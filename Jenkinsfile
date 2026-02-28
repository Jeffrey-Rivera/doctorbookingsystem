pipeline {
  agent any

  parameters {
    choice(
      name: 'BUMP',
      choices: ['patch', 'minor', 'major'],
      description: 'Which semantic version bump? patch=bugfix, minor=new feature, major=breaking change'
    )
    booleanParam(
      name: 'CREATE_GIT_TAG',
      defaultValue: true,
      description: 'Create a git tag like v1.2.3 after a successful build?'
    )
  }

  environment {
    AWS_REGION     = "ca-central-1"
    AWS_ACCOUNT_ID = "730335227222"
    ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    ECR_BACKEND  = "${ECR_REGISTRY}/doctor-backend"
    ECR_FRONTEND = "${ECR_REGISTRY}/doctor-frontend"
    ECR_ADMIN    = "${ECR_REGISTRY}/doctor-admin"

    EC2_HOST    = "16.52.37.174"
    EC2_APP_DIR = "/home/ubuntu"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    // ✅ 1) SEMVER AUTO TAGGING
    stage("Compute Semantic Version") {
      steps {
        script {
          // Find latest tag like v1.2.3 (if none, start at v0.1.0)
          def nextVer = sh(
            returnStdout: true,
            script: '''
              set -e

              # Make sure tags are available
              git fetch --tags --force >/dev/null 2>&1 || true

              LAST_TAG=$(git tag -l "v[0-9]*.[0-9]*.[0-9]*" --sort=-v:refname | head -n 1)

              if [ -z "$LAST_TAG" ]; then
                LAST_TAG="v0.1.0"
              fi

              VER="${LAST_TAG#v}"
              MAJOR=$(echo "$VER" | cut -d. -f1)
              MINOR=$(echo "$VER" | cut -d. -f2)
              PATCH=$(echo "$VER" | cut -d. -f3)

              case "${BUMP}" in
                major)
                  MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0 ;;
                minor)
                  MINOR=$((MINOR+1)); PATCH=0 ;;
                patch)
                  PATCH=$((PATCH+1)) ;;
                *)
                  echo "Unknown BUMP: ${BUMP}" >&2
                  exit 1 ;;
              esac

              echo "${MAJOR}.${MINOR}.${PATCH}"
            '''
          ).trim()

          env.IMAGE_TAG = nextVer
          echo "✅ New semantic version: ${env.IMAGE_TAG} (BUMP=${params.BUMP})"
        }
      }
    }

    stage("Login to ECR") {
      steps {
        withCredentials([usernamePassword(credentialsId: 'aws-ecr-creds',
          usernameVariable: 'AWS_ACCESS_KEY_ID',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
          sh '''
            set -e
            aws ecr get-login-password --region ${AWS_REGION} \
              | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          '''
        }
      }
    }

    stage("Build Images") {
      steps {
        sh '''
          set -e
          docker build -t doctor-backend:${IMAGE_TAG} backend
          docker build --build-arg VITE_BACKEND_URL=http://${EC2_HOST}:4000 -t doctor-frontend:${IMAGE_TAG} .
          docker build --build-arg VITE_BACKEND_URL=http://${EC2_HOST}:4000 -t doctor-admin:${IMAGE_TAG} admin
        '''
      }
    }

    stage("Tag & Push to ECR (semver)") {
      steps {
        sh '''
          set -e

          docker tag doctor-backend:${IMAGE_TAG}  ${ECR_BACKEND}:${IMAGE_TAG}
          docker tag doctor-frontend:${IMAGE_TAG} ${ECR_FRONTEND}:${IMAGE_TAG}
          docker tag doctor-admin:${IMAGE_TAG}    ${ECR_ADMIN}:${IMAGE_TAG}

          docker push ${ECR_BACKEND}:${IMAGE_TAG}
          docker push ${ECR_FRONTEND}:${IMAGE_TAG}
          docker push ${ECR_ADMIN}:${IMAGE_TAG}
        '''
      }
    }

    // Optional but recommended: create a git tag so version history is real
    stage("Create Git Tag (optional)") {
      when { expression { return params.CREATE_GIT_TAG } }
      steps {
        script {
          sh """
            set -e
            git tag v${IMAGE_TAG} || true
            git push origin v${IMAGE_TAG} || true
          """
        }
      }
    }

    // ✅ 2) HEALTH CHECKS + ✅ 3) ROLLBACK (built into deploy stage)
    stage("Deploy on EC2 (update tags + restart + healthcheck + rollback)") {
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          withCredentials([usernamePassword(credentialsId: 'aws-ecr-creds',
            usernameVariable: 'AWS_ACCESS_KEY_ID',
            passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {

            sh '''
              set -e
              ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
                set -e

                aws ecr get-login-password --region ${AWS_REGION} \
                  | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                cd ${EC2_APP_DIR}

                # Ensure .env exists
                if [ ! -f .env ]; then touch .env; fi

                # --- Save previous tags for rollback ---
                PREV_BACKEND_TAG=\$(grep -E '^BACKEND_TAG=' .env | cut -d= -f2 || true)
                PREV_FRONTEND_TAG=\$(grep -E '^FRONTEND_TAG=' .env | cut -d= -f2 || true)
                PREV_ADMIN_TAG=\$(grep -E '^ADMIN_TAG=' .env | cut -d= -f2 || true)

                echo '--- Previous deploy tags ---'
                echo BACKEND_TAG=\$PREV_BACKEND_TAG
                echo FRONTEND_TAG=\$PREV_FRONTEND_TAG
                echo ADMIN_TAG=\$PREV_ADMIN_TAG

                rollback() {
                  echo '❌ Deploy failed. Rolling back...'
                  # Restore old tags (only if they existed)
                  if [ -n \"\$PREV_BACKEND_TAG\" ]; then
                    sed -i 's/^BACKEND_TAG=.*/BACKEND_TAG='\$PREV_BACKEND_TAG'/' .env || echo BACKEND_TAG=\$PREV_BACKEND_TAG >> .env
                  fi
                  if [ -n \"\$PREV_FRONTEND_TAG\" ]; then
                    sed -i 's/^FRONTEND_TAG=.*/FRONTEND_TAG='\$PREV_FRONTEND_TAG'/' .env || echo FRONTEND_TAG=\$PREV_FRONTEND_TAG >> .env
                  fi
                  if [ -n \"\$PREV_ADMIN_TAG\" ]; then
                    sed -i 's/^ADMIN_TAG=.*/ADMIN_TAG='\$PREV_ADMIN_TAG'/' .env || echo ADMIN_TAG=\$PREV_ADMIN_TAG >> .env
                  fi

                  echo '--- Rolled back tags ---'
                  cat .env

                  docker compose pull
                  docker compose up -d --remove-orphans

                  docker ps --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
                  exit 1
                }

                # If anything fails after this point, rollback
                trap rollback ERR

                # --- Update tags to new version ---
                sed -i 's/^BACKEND_TAG=.*/BACKEND_TAG=${IMAGE_TAG}/' .env || echo BACKEND_TAG=${IMAGE_TAG} >> .env
                sed -i 's/^FRONTEND_TAG=.*/FRONTEND_TAG=${IMAGE_TAG}/' .env || echo FRONTEND_TAG=${IMAGE_TAG} >> .env
                sed -i 's/^ADMIN_TAG=.*/ADMIN_TAG=${IMAGE_TAG}/' .env || echo ADMIN_TAG=${IMAGE_TAG} >> .env

                echo '--- Current deploy tags ---'
                cat .env

                docker compose pull
                docker compose up -d --remove-orphans

                # --- Health checks with retries ---
                check_url() {
                  URL=\$1
                  NAME=\$2
                  echo \"Checking \$NAME -> \$URL\"
                  for i in \$(seq 1 10); do
                    if curl -fsS --max-time 5 \"\$URL\" >/dev/null; then
                      echo \"✅ \$NAME healthy\"
                      return 0
                    fi
                    echo \"...retry \$i/10\"
                    sleep 3
                  done
                  echo \"❌ \$NAME failed health check\"
                  return 1
                }

                check_url http://localhost:4000/ backend
                check_url http://localhost:81/ frontend
                check_url http://localhost:82/ admin

                # If we reach here, health checks passed → disable trap rollback
                trap - ERR

                echo '✅ Deploy + health checks SUCCESS'
                docker ps --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
              "
            '''
          }
        }
      }
    }
  }
}
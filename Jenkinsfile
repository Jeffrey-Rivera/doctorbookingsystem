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
        withCredentials([usernamePassword(
          credentialsId: 'github-credentials-PAT',
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_PAT'
        )]) {
          sh '''
            set -e
            git config user.email "jenkins@local"
            git config user.name  "jenkins"

            # make sure remote is the same repo but authenticated for push
            git remote set-url origin https://${GIT_USER}:${GIT_PAT}@github.com/Jeffrey-Rivera/doctorbookingsystem.git

            # create tag only if it doesn't exist
            if git rev-parse "v${IMAGE_TAG}" >/dev/null 2>&1; then
              echo "Tag v${IMAGE_TAG} already exists, skipping"
            else
              git tag "v${IMAGE_TAG}"
              git push origin "v${IMAGE_TAG}"
            fi
          '''
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

            sh """
              set -e
              ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} 'bash -lc "
                set -e

                cd ${EC2_APP_DIR}

                # ensure .env exists
                [ -f .env ] || touch .env

                # capture CURRENT tags for rollback
                OLD_BACKEND=\\\$(grep -E '^BACKEND_TAG=' .env | cut -d= -f2 || true)
                OLD_FRONTEND=\\\$(grep -E '^FRONTEND_TAG=' .env | cut -d= -f2 || true)
                OLD_ADMIN=\\\$(grep -E '^ADMIN_TAG=' .env | cut -d= -f2 || true)

                echo \\\"Old tags: backend=\\\$OLD_BACKEND frontend=\\\$OLD_FRONTEND admin=\\\$OLD_ADMIN\\\"

                # login to ECR
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                # write NEW tags
                sed -i \\\"s/^BACKEND_TAG=.*/BACKEND_TAG=${IMAGE_TAG}/\\\" .env || echo BACKEND_TAG=${IMAGE_TAG} >> .env
                sed -i \\\"s/^FRONTEND_TAG=.*/FRONTEND_TAG=${IMAGE_TAG}/\\\" .env || echo FRONTEND_TAG=${IMAGE_TAG} >> .env
                sed -i \\\"s/^ADMIN_TAG=.*/ADMIN_TAG=${IMAGE_TAG}/\\\" .env || echo ADMIN_TAG=${IMAGE_TAG} >> .env

                echo \\\"--- Deploying tags ---\\\"
                cat .env

                docker compose pull
                docker compose up -d --remove-orphans

                # healthcheck (retry)
                echo \\\"--- Healthcheck ---\\\"
                ok=0
                for i in \\\$(seq 1 12); do
                  # backend health (change path if you have /health)
                  if curl -fsS --max-time 5 http://localhost:4000/ >/dev/null; then
                    ok=1
                    break
                  fi
                  echo \\\"Retry \\\$i/12...\\\"
                  sleep 5
                done

                if [ \\\"\\\$ok\\\" -ne 1 ]; then
                  echo \\\"❌ Healthcheck failed. Rolling back...\\\"

                  # restore old tags (if empty, keep current file line as-is)
                  [ -n \\\"\\\$OLD_BACKEND\\\" ] && sed -i \\\"s/^BACKEND_TAG=.*/BACKEND_TAG=\\\$OLD_BACKEND/\\\" .env
                  [ -n \\\"\\\$OLD_FRONTEND\\\" ] && sed -i \\\"s/^FRONTEND_TAG=.*/FRONTEND_TAG=\\\$OLD_FRONTEND/\\\" .env
                  [ -n \\\"\\\$OLD_ADMIN\\\" ] && sed -i \\\"s/^ADMIN_TAG=.*/ADMIN_TAG=\\\$OLD_ADMIN/\\\" .env

                  echo \\\"--- Rolled back tags ---\\\"
                  cat .env

                  docker compose pull
                  docker compose up -d --remove-orphans

                  exit 1
                fi

                echo \\\"✅ Healthcheck passed. Deploy success.\\\"
                docker ps --format \\\"table {{.Names}}\\\\t{{.Image}}\\\\t{{.Status}}\\\"
              "'
            """
          }
        }
      }
    }
  }
}
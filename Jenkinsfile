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

    EKS_CLUSTER_NAME = "doctor-eks"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Compute Semantic Version") {
      steps {
        script {
          def nextVer = sh(
            returnStdout: true,
            script: '''
              set -e

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
        withCredentials([usernamePassword(
          credentialsId: 'aws-ecr-creds',
          usernameVariable: 'AWS_ACCESS_KEY_ID',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
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
          docker build --build-arg VITE_BACKEND_URL= -t doctor-frontend:${IMAGE_TAG} .
          docker build --build-arg VITE_BACKEND_URL= -t doctor-admin:${IMAGE_TAG} admin
        '''
      }
    }

    stage("Tag & Push to ECR") {
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

    stage("Create Git Tag (optional)") {
      when {
        expression { return params.CREATE_GIT_TAG }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'github-credentials-PAT',
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_PAT'
        )]) {
          sh '''
            set -e
            git config user.email "jenkins@local"
            git config user.name "jenkins"

            git remote set-url origin https://${GIT_USER}:${GIT_PAT}@github.com/Jeffrey-Rivera/doctorbookingsystem.git

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

    stage("Deploy to EKS") {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'aws-ecr-creds',
          usernameVariable: 'AWS_ACCESS_KEY_ID',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
          sh '''
            set -e

            mkdir -p ~/.kube

            aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}

            kubectl get nodes

            kubectl -n doctor set image deployment/doctor-backend backend=${ECR_BACKEND}:${IMAGE_TAG}
            kubectl -n doctor set image deployment/doctor-frontend frontend=${ECR_FRONTEND}:${IMAGE_TAG}
            kubectl -n doctor set image deployment/doctor-admin admin=${ECR_ADMIN}:${IMAGE_TAG}

            kubectl -n doctor rollout status deployment/doctor-backend --timeout=180s
            kubectl -n doctor rollout status deployment/doctor-frontend --timeout=180s
            kubectl -n doctor rollout status deployment/doctor-admin --timeout=180s

            echo "✅ EKS rollout successful"
            kubectl -n doctor get pods
            kubectl -n doctor get deployment
            kubectl -n doctor get ingress
          '''
        }
      }
    }
  }
}
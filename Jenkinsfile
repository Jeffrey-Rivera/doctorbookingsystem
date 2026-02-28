pipeline {
  agent any

  environment {
    AWS_REGION     = "ca-central-1"
    AWS_ACCOUNT_ID = "730335227222"
    ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    ECR_BACKEND  = "${ECR_REGISTRY}/doctor-backend"
    ECR_FRONTEND = "${ECR_REGISTRY}/doctor-frontend"
    ECR_ADMIN    = "${ECR_REGISTRY}/doctor-admin"

    // Version tag for this build
    IMAGE_TAG = "${BUILD_NUMBER}"

    EC2_HOST    = "16.52.37.174"
    EC2_APP_DIR = "/home/ubuntu"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
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
          docker build -t doctor-admin:${IMAGE_TAG} admin
        '''
      }
    }

    stage("Tag & Push to ECR (versioned)") {
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

    stage("Deploy on EC2 (update tags + restart)") {
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

                # Update .env tags (versioned deploy)
                if [ ! -f .env ]; then touch .env; fi
                sed -i 's/^BACKEND_TAG=.*/BACKEND_TAG=${IMAGE_TAG}/' .env || echo BACKEND_TAG=${IMAGE_TAG} >> .env
                sed -i 's/^FRONTEND_TAG=.*/FRONTEND_TAG=${IMAGE_TAG}/' .env || echo FRONTEND_TAG=${IMAGE_TAG} >> .env
                sed -i 's/^ADMIN_TAG=.*/ADMIN_TAG=${IMAGE_TAG}/' .env || echo ADMIN_TAG=${IMAGE_TAG} >> .env

                echo '--- Current deploy tags ---'
                cat .env

                docker compose pull
                docker compose up -d --remove-orphans

                docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
              "
            '''
          }
        }
      }
    }
  }
}
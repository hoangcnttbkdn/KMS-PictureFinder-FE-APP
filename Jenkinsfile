pipeline {
    agent any
    environment {
        DOCKER_IMAGE="hoangsndxqn/kms-picture-finder-fe-app"
        DOCKER_URL="./docker/Dockerfile.prod"
    }
    stages {
        stage('Test') {
            steps {
                sh 'echo Test passed!'
            }
        }
        stage('Docker build and push') {
            environment {
                DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
            }
            steps {
                script {
                    echo DOCKER_TAG
                }
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f ${DOCKER_URL} . "
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                sh "docker image ls | grep ${DOCKER_IMAGE}"
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
                sh "docker image rm ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker image rm ${DOCKER_IMAGE}:latest"
                sh 'docker rmi $(docker images -f "dangling=true" -q)'
            }
        }
        stage('SSH server and deploy') {
            steps{
                sh 'echo deploy'
                sh "ssh -i /var/jenkins_home/.ssh/feserver hoangsndxqn@34.142.135.202 './deployFEapp.sh'"
            }
        }
    }
    post {
    success {
      echo "SUCCESSFUL"
    }
    failure {
      echo "FAILED"
    }
  }
}
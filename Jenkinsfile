pipeline {
    agent any
    environment {
        DOCKER_IMAGE="hoangsndxqn/kms-picture-finder-fe-app"
        DOCKER_URL="./docker/Dockerfile.prod"
    }
    stages {
        stage('Prepare workspace') {
            steps {
                echo 'Prepare workspace'
                step([$class: 'WsCleanup'])
                script {
                    def commit = checkout scm
                    env.BRANCH_NAME = commit.GIT_BRANCH.replace('origin/', '')
                }
            }
        }
        
        stage('Docker build and push images') {
            environment {
                DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
            }
            steps {
                script {
                    echo BRANCH_NAME
                    echo DOCKER_TAG
                }
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f ${DOCKER_URL} . "
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:dev-latest"
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                sh "docker image ls | grep ${DOCKER_IMAGE}"
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:dev-latest"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
                sh "docker image rm ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker image rm ${DOCKER_IMAGE}:dev-latest"
                sh "docker image rm ${DOCKER_IMAGE}:latest"
                sh 'docker system prune -f'
            }
        }

        stage('Deploy: Develop') {
            when {
                expression {
                    return (env.BRANCH_NAME == 'develop')
                }
            }
            steps {
                sh 'echo DEPLOY_DEV'
                sh "ssh -i /var/jenkins_home/.ssh/feserver hoangsndxqn@34.142.135.202 './developFE.sh'"
            }
        }

        stage('Deploy: RELEASE') {
            when {
                expression {
                    return (env.BRANCH_NAME == "refs/tags/${GIT_BRANCH.tokenize('/').pop()}")
                }
            }
            steps {
                sh 'echo DEPLOY_RELEASE'
                sh "ssh -i /var/jenkins_home/.ssh/feserver hoangsndxqn@34.142.135.202 './releaseFE.sh'"
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

pipeline {
    agent any

    environment {
        // Update with your Jenkins credentials IDs
        GIT_REPO = "https://github.com/akhiLeeesh/3-tire.git"
        EC2_USER = "ubuntu"
        EC2_HOST = "13.201.222.161"
        SSH_CREDENTIALS_ID = "ec2-ssh-key" // Jenkins SSH key credential ID
        FRONTEND_DIR = "frontend"
        BACKEND_DIR = "backend"
        FRONTEND_BUILD_DIR = "build" // For React; change if Angular
        BACKEND_JAR = "target/backend-0.0.1-SNAPSHOT.jar" // Update if jar name is different
        REMOTE_FRONTEND_PATH = "/var/www/html"
        REMOTE_BACKEND_PATH = "/home/ubuntu/backend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Building frontend..."
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        echo "Building backend..."
                        mvn clean package -DskipTests
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    // Upload frontend build
                    sh """
                        echo "Uploading frontend to EC2..."
                        scp -o StrictHostKeyChecking=no -r ${FRONTEND_DIR}/${FRONTEND_BUILD_DIR}/* ${EC2_USER}@${EC2_HOST}:${REMOTE_FRONTEND_PATH}
                    """

                    // Upload backend jar
                    sh """
                        echo "Uploading backend jar to EC2..."
                        scp -o StrictHostKeyChecking=no ${BACKEND_DIR}/${BACKEND_JAR} ${EC2_USER}@${EC2_HOST}:${REMOTE_BACKEND_PATH}/app.jar
                    """

                    // Restart backend
                    sh """
                        echo "Restarting backend on EC2..."
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                            pkill -f 'java -jar' || true
                            nohup java -jar ${REMOTE_BACKEND_PATH}/app.jar > backend.log 2>&1 &
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}

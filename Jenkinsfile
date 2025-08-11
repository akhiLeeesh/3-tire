pipeline {
    agent any

    environment {
        EC2_USER = "ubuntu"
        EC2_HOST = "ec2-13-201-222-161.ap-south-1.compute.amazonaws.com"
        EC2_KEY = "web.pem" // This should be stored in Jenkins credentials
        FRONTEND_PATH = "frontend"
        BACKEND_PATH = "backend"
    }

    stages {

        stage('Check Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -l'
            }
        }

        stage('Build Frontend') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                dir("${FRONTEND_PATH}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            agent {
                docker { image 'maven:3.8.8-openjdk-17' }
            }
            steps {
                dir("${BACKEND_PATH}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'EC2_KEYFILE')]) {
                    
                    // Upload Frontend build
                    sh """
                        scp -i ${EC2_KEYFILE} -r ${FRONTEND_PATH}/build/* ${EC2_USER}@${EC2_HOST}:/home/ubuntu/frontend/
                    """

                    // Upload Backend JAR
                    sh """
                        scp -i ${EC2_KEYFILE} ${BACKEND_PATH}/target/*.jar ${EC2_USER}@${EC2_HOST}:/home/ubuntu/backend/app.jar
                    """

                    // Configure & restart services on EC2
                    sh """
                        ssh -i ${EC2_KEYFILE} ${EC2_USER}@${EC2_HOST} << 'EOF'
                            # Install Nginx if not installed
                            sudo apt update
                            sudo apt install -y nginx

                            # Nginx config
                            sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOL
server {
    listen 80;
    root /home/ubuntu/frontend;
    index index.html;
    location / {
        try_files \$uri /index.html;
    }
    location /api/ {
        proxy_pass http://localhost:8081/;
    }
}
EOL'

                            sudo nginx -t
                            sudo systemctl restart nginx

                            # Start backend
                            nohup java -jar /home/ubuntu/backend/app.jar > backend.log 2>&1 &
                        EOF
                    """
                }
            }
        }
    }
}

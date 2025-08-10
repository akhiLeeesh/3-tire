pipeline {
    agent any

    stages {
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18'
                    args '-u root:root' // optional: avoid permission issues
                }
            }
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'
                    echo 'Building frontend...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            agent {
                docker {
                    image 'maven:3.8.8-openjdk-17'
                    args '-u root:root'
                }
            }
            steps {
                dir('backend') {
                    echo 'Building backend with Maven...'
                    sh 'mvn clean install -DskipTests'
                }
            }
        }
    }
}

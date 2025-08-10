pipeline {
    agent any

    stages {
        stage('Build Frontend') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                dir('frontend') {  // go to frontend folder
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
                dir('backend') {  // go to backend folder
                    sh 'mvn clean install'
                }
            }
        }
    }
}

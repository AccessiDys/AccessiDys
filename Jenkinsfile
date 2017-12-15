pipeline {
    agent any
    stages {
        stage('Checkout') {

                    steps {
                        checkout scm
                    }
                }
        stage('Install') {
             agent {
                docker {
                    image 'node:8.9.1'
                    reuseNode true
                }
            }
            steps {
                sh 'npm i'
            }
        }
        stage('Build') {
             agent {
                docker {
                    image 'electronuserland/electron-builder:wine'
                    reuseNode true
                }
            }
            steps {
              sh 'node i -g electron-zip-packager'
              sh 'electron-zip-packager app/ "Accessidys" --asar=true --out=..\\dist\\win --platform=win32 --arch=ia32 --icon="styles/images/favicon.ico" --ignore=builder.json --ignore=README.md --overwrite'
            }
        }
    }
}

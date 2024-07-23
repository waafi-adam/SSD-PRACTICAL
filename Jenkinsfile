pipeline {
    agent any

    environment {
        NODE_VERSION = '16.x' // Specify your desired Node.js version
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // Install Node.js and other dependencies
                    sh '''
                        curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | bash -
                        apt-get install -y nodejs
                        apt-get install -y lsof
                        apt-get install -y procps
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // No build step is necessary for this simple app, but placeholder
                    echo 'Building...'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Placeholder for testing step
                    echo 'Running tests...'
                    // You can add your test command here
                }
            }
        }

        stage('Run') {
            steps {
                script {
                    // Run the app
                    sh 'node app.js &'
                }
            }
        }
    }

    post {
        always {
            // Clean up any processes or resources
            sh 'pkill -f "node app.js" || true'
        }
    }
}

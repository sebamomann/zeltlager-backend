def image
def branch_name = "${env.BRANCH_NAME}" as String
def build_number = "${env.BUILD_NUMBER}" as String
def commit_hash

def tag_name = 'jb_' + branch_name + "_" + build_number

def api_image_name = 'zeltlager/zeltlager-backend:' + tag_name


pipeline {
    agent any

    environment {
        GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN = credentials('GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN')
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Preamble') {
            steps {
                script {
                    echo 'Updating status'
                    updateStatus("pending")
                }
                script {
                    commit_hash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

                    echo 'Control Variables'
                    echo '-------------------'
                    echo "COMMIT HASH: ${commit_hash}"
                    echo "BRANCH NAME: ${branch_name}"
                    echo "BUILD NUMBER: ${build_number}"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    image = docker.build(api_image_name)
                }
            }
        }

        stage('Publish to registry') {
            when {
                expression {
                    return branch_name =~ /^\d\.\d\.\d(-\d+)?/
                }
            }
            steps {
                script {
                    docker.withRegistry('http://localhost:34015') {
                        image.push(branch_name)
                    }
                }
            }
        }

        stage('Publish to registry - master') {
            when {
                expression {
                    return branch_name =~ "master"
                }
            }
            steps {
                script {
                    docker.withRegistry('http://localhost:34015') {
                        image.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    sh 'docker network rm ' + network_name
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker image rm ' + api_image_name + ' -f'
                } catch (err) {
                    echo err.getMessage()
                }
            }
        }
        success {
            script {
                updateStatus("success")

                try {
                    sh 'docker image prune --filter label=stage=intermediate -f --volumes'
                } catch (err) {
                    echo err.getMessage()
                }
            }
        }
        failure {
            script {
                updateStatus("failure")
            }
        }
        aborted {
            script {
                updateStatus("error")
            }
        }
    }
}

void updateStatus(String value) {
    sh 'curl -s "https://api.github.com/repos/sebamomann/zeltlager-backend/statuses/$GIT_COMMIT" \\\n' +
            '  -H "Content-Type: application/json" \\\n' +
            '  -H "Authorization: token $GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN" \\\n' +
            '  -X POST \\\n' +
            '  -d "{\\"state\\": \\"' + value + '\\", \\"description\\": \\"Jenkins\\", \\"context\\": \\"continuous-integration/jenkins\\", \\"target_url\\": \\"https://jenkins.dankoe.de/job/zeltlager-backend/job/$BRANCH_NAME/$BUILD_NUMBER/console\\"}" \\\n' +
            '  '
}

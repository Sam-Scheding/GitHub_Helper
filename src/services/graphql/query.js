import { apolloClient } from '.'
import gql from 'graphql-tag'
import { GITHUB_USERNAME } from '../../config'
import { RAW_GRAPHQL_RESPONSE } from '../../test/data'

const query = gql`
query ($username: String!, $approvedPullRequests: String!) {
	user(login: $username) {

    # User Information
		avatarUrl
		name

    # My Pull Requests
		myPullRequests: pullRequests(first: 20, states: OPEN) {
			nodes {
				title
				url
				author {
					login
				}
				repository {
					name
				}
				number
				reviews(first: 20) {
					# Reviews (approved, commented, requested changes)
					nodes {
						author {
							login
						}
						state # If the PR has been approved
					}
				}
				reviewThreads(first: 100) {
					nodes {
						isResolved
						isOutdated
						comments(first: 1) {
							# A review thread can have many many responses, but the first one will always be the review author
							nodes {
								author {
									login
								}
							}
						}
					}
				}
				mergeable
				commits(last: 1) {
					nodes {
						commit {
							status {
								contexts {
									targetUrl
								}
								state
							}
						}
					}
				}
			}
		}
  }
  # Approved Pull Requests
  approvedPullRequests: search(
    query: $approvedPullRequests
    type: ISSUE
    last: 30
  ) {
    edges {
      node {
        ... on PullRequest {
          title
          author {
            login
          }
					number
					repository
          url
					commits(last: 1) {
						nodes {
							commit {
								status {
									contexts {
										targetUrl
									}
									state
								}
							}
						}
					}
          reviewThreads(first: 20) {
            nodes {
              isOutdated
              isResolved
              comments(first: 1) {
                nodes {
                  author {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

`

export const fetchAllFromGitHub = async () => {
  return RAW_GRAPHQL_RESPONSE.data

  // const response = await apolloClient.query({
  //   query,
  //   variables: {
  //     username: GITHUB_USERNAME,
  //     approvedPullRequests: `is:pr is:open reviewed-by:${GITHUB_USERNAME} -author:${GITHUB_USERNAME}`,
  //   },
  //   fetchPolicy: 'network-only',
  // })

  // const { data } = response

  // if (data) {
  //   console.log('pullRequests', data);
  //   return data
    
  // }

  // throw new Error('Unable to query GitHub')
}


/*
GET STALE BRANCHES (kind of works)

query ($username: String!) {
	user(login: $username) {
		name
		staleBranches: pullRequests(first: 100, states: CLOSED) {
			nodes {
				title
				url
				repository {
					name
				}
        headRef {
          name
          target {
            ... on Commit {
              author {
                user {
                  ... on User {
                    name
                  }
                }
              }
            }
          }
        }
			}
		}
	}
}

*/
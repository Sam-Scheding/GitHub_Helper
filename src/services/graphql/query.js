import { apolloClient } from '.'
import gql from 'graphql-tag'
import { GITHUB_USERNAME } from '../../config'
import { RAW_GRAPHQL_RESPONSE } from '../../testUtils/data'

const query = gql`
query ($username: String!, $approvedPullRequests: String!, $taggedPullRequests: String!) {
	user: user(login: $username) {
    # User Information
		avatarUrl
		name
	}
	myPullRequests: user(login: $username) {
    # My Pull Requests
		pullRequests(
			first: 20, 
			states: OPEN
		) {
			nodes {
				title
				url
				mergeable
				number
				author { login }
				repository { name }
				reviews(first: 20) {
					nodes {
						author { login }
						state # (APPROVED, COMMENTED, PENDING)
					}
				}
				reviewThreads(first: 50) {
					nodes {
						isResolved
						isOutdated
						comments(first: 1) {
							# A review thread can have many many responses, but the first one will always be the review author
							nodes {
								author { login }
							}
						}
					}
				}
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

	# Tagged Pull Requests
	taggedPullRequests: search(
		query: $taggedPullRequests
		type: ISSUE
		last: 30
	) {
		edges {
			node {
				... on PullRequest {
					title
					url
					number
					repository { name }
					author { login } # Pull Request Author
					headRef { name } # Branch
					baseRefName # What branch it will merge into 
					mergeable # Whether the branch has merge conflicts
					reviewRequests(first:7) { # Tagged reviewers
						nodes {
							requestedReviewer {
								... on User {
									name
									login
								}
							}
						}
					}
					reviews(first:20){ # Reviews (approved, commented, requested changes)
						nodes { 
							author { login }
							state # If the PR has been approved
						}
					}
					reviewThreads(first:50) {
						nodes {
							isResolved
							isOutdated
							comments(first:1) { # A review thread can have many many responses, but the first one will always be the review author
								nodes {
									author { login }
								}
							}
						}
					}
					commits(last:1) { # last:1 refers to the most recent commit
						nodes {
							commit {
								status {
									contexts {
										targetUrl # The URL for the BK Build
									}
									state # Whether the latest build passed or failed
								}
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
					number
          url
					mergeable
          author { login }
					repository { name }
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
					reviews(first: 20) {
						nodes {
							author { login }
							state # (APPROVED, COMMENTED, PENDING)
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
	builds: user(login: $username) {
		pullRequests(last: 10) {
			nodes {
				title
				url
				commits(last: 10) {
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
}
`

export const fetchAllFromGitHub = async () => {
  // return RAW_GRAPHQL_RESPONSE

  const response = await apolloClient.query({
    query,
    variables: {
      username: GITHUB_USERNAME,
			taggedPullRequests: `is:pr is:open review-requested:${GITHUB_USERNAME} -author:${GITHUB_USERNAME}`,
      approvedPullRequests: `is:pr is:open reviewed-by:${GITHUB_USERNAME} review:approved -author:${GITHUB_USERNAME}`,
    },
    fetchPolicy: 'network-only',
  })

  const { data } = response

  if (data) {
    console.log('pullRequests', data);
    return data
    
  }

  throw new Error('Unable to query GitHub')
}


/*
GET STALE BRANCHES (kind of works)

query ($username: String!) {
	user(login: $username) {
		name
		pullRequests(first: 100) {
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
import { GITHUB_USERNAME } from "../../config"

export const REVIEW_STATES = {
  APPROVED: 'APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  COMMENTED: 'COMMENTED',
  DISMISSED: 'DISMISSED',
  PENDING: 'PENDING',
}

export const BUILD_STATUSES = {
  EXPECTED: 'EXPECTED',
  ERROR: 'ERROR',
  FAILURE: 'FAILURE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
}

export const MERGE_STATUSES = {
  CONFLICTING: 'CONFLICTING',
  UNKNOWN: 'UNKNOWN',
  MERGEABLE: 'MERGEABLE',
}

export const transformAPIResponse = (response) => {
  const user = response.user
  const myPullRequests = transformMyPullRequests(response.myPullRequests.pullRequests.nodes)
  const taggedPullRequests = transformTaggedPullRequests(response.taggedPullRequests.edges)
  const approvedPullRequests = transformApprovedPullRequests(response.approvedPullRequests.edges)
  const runningBuilds = getRunningBuilds(response.builds.pullRequests.nodes)

  return {
    user, 
    myPullRequests,
    taggedPullRequests,
    approvedPullRequests,
    runningBuilds,
  }
}

const transformMyPullRequests = (pullRequests) => {
  const transformedPullRequests = pullRequests.map(pr => {    
    console.log('pr.mergeable', pr.mergeable);
    
    const transformedPullRequest = {
      title: pr.title,
      url: pr.url,
      number: pr.number,
      repository: pr.repository.name,
      author: pr.author.login,
      build: {},
      mergeStatus: pr.mergeable,
      upToDateWithParentBranch: pr.mergeable !== MERGE_STATUSES.UNKNOWN, 
      freshComments: getNumFreshComments(pr.reviewThreads.nodes),
      approvals: getApprovals(pr.reviews.nodes),
      unpublishedReviews: unpublishedReviews(pr.reviews.nodes)
    }

    // Some Pull Requests do not have a build (e.g. Infra PRs)
    if(pr.commits.nodes[0].commit.status){
      transformedPullRequest.build = {
        status: pr.commits.nodes[0].commit.status.state,
        url: pr.commits.nodes[0].commit.status.contexts[0].targetUrl, 
      }
    }

    return transformedPullRequest
  })

  return sortPullRequests(transformedPullRequests)
}

const getApprovals = reviews => {

  /**
   * TODO: Reviews can be APPROVED, CHANGES_REQUESTED, COMMENTED, etc
   * If a reviewer APPROVES, and then later COMMENTS (revoking their approval), 
   * the Approval will still show.
   * 
   * So, we need to get only the most recent review status for each reviewer. 
   * And then filter that array for approvals
   */
  const approvals = reviews.filter((review) => {
    return review.state === REVIEW_STATES.APPROVED
  })

  return approvals.map(approval => {
    return {
      name: approval.author.login,
      // TODO: Can add avatar and review state here if needed
    }
  })
}

const getNumFreshComments = reviewThreads => {
  // A comment can have many replies, which is why it's necessary to get [0] index
  const comments = reviewThreads.filter(review => {
    return review.comments.nodes[0].author.login !== GITHUB_USERNAME
  })

  const freshComments = comments.filter(comment => {
    return !comment.isResolved && !comment.isOutdated
  })

  return freshComments.length
}

const sortPullRequests = pullRequests => {
  return pullRequests.sort((a, b) => {
    return a.repository.localeCompare(b.repository) 
      || a.title.localeCompare(b.title)
  })
}

const transformApprovedPullRequests = pullRequests => {
  const transformedPullRequests = pullRequests.map(pr => {
    const transformedPullRequest = {
      title: pr.node.title,
      author: pr.node.author.login,
      number: pr.node.number,
      url: pr.node.url,
      upToDateWithParentBranch: pr.node.mergeable !== MERGE_STATUSES.UNKNOWN, 
      repository: pr.node.repository.name,
      staleComments: getNumStaleComments(pr.node),
      mergeStatus: pr.node.mergeable,
      build: {},
    }

    // Some Pull Requests do not have a build (e.g. Infra PRs)
    if(pr.node.commits.nodes[0].commit.status){
      transformedPullRequest.build = {
        status: pr.node.commits.nodes[0].commit.status.state,
        url: pr.node.commits.nodes[0].commit.status.contexts[0].targetUrl, 
      }
    }

    return transformedPullRequest
  })

  return sortPullRequests(transformedPullRequests)
}

const getNumStaleComments = pr => {
  const staleComments = pr.reviewThreads.nodes.filter(reviewThread => {
    const author = reviewThread.comments.nodes[0].author.login

    return author === GITHUB_USERNAME && !reviewThread.isOutdated && !reviewThread.isResolved
  })

  return staleComments.length
}

const unpublishedReviews = reviews => {
  const unpublishedReviews = reviews.filter(review => {
    return review.state === REVIEW_STATES.PENDING
  })

  const authors = unpublishedReviews.map(approval => {
    return approval.author.login
  })

  return Array.from(new Set(authors))
}

const getRunningBuilds = pullRequests => {
  const runningBuilds = []

  pullRequests.forEach(pr => {
    pr.commits.nodes.forEach(node => {
      
      if(node.commit.status?.state === BUILD_STATUSES.PENDING) {
        runningBuilds.push({
          buildURL: node.commit.status.contexts[0].targetUrl,
          pullRequestURL: pr.url,
          pullRequestTitle: pr.title,
        })
      }
    })
  })

  return runningBuilds
}


const transformTaggedPullRequests = pullRequests => {
  const transformedPullRequests = pullRequests.map(pr => {
    const transformedPullRequest = {
      title: pr.node.title,
      author: pr.node.author.login,
      number: pr.node.number,
      build: {},
      url: pr.node.url,
      upToDateWithParentBranch: pr.node.mergeable !== MERGE_STATUSES.UNKNOWN, 
      repository: pr.node.repository.name,
      staleComments: getNumStaleComments(pr.node),
      mergeStatus: pr.node.mergeable,
    }

    // Some Pull Requests do not have a build (e.g. Infra PRs)
    if(pr.node.commits.nodes[0].commit.status){
      transformedPullRequest.build = {
        status: pr.node.commits.nodes[0].commit.status.state,
        url: pr.node.commits.nodes[0].commit.status.contexts[0].targetUrl, 
      }
    }

    return transformedPullRequest
  })
  // console.log('transFormedPullRequests', transformedPullRequests);
  
  return sortPullRequests(transformedPullRequests)
}
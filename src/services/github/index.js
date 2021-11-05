import { GITHUB_USERNAME } from "../../config"

export const transformAPIResponse = (response) => {
  const user = transformUser(response.user)
  const myPullRequests = transformMyPullRequests(response.user.myPullRequests.nodes)
  const approvedPullRequests = transformApprovedPullRequests(response.approvedPullRequests.edges)

  return {
    user, 
    myPullRequests,
    approvedPullRequests,
  }
}

const transformUser = (rawUser) => {
  return {
    name: rawUser.name,
    avatar: rawUser.avatar,
  }
}

const transformMyPullRequests = (pullRequests) => {  
  const transformedPullRequests = pullRequests.map(pr => {
    const transFormedPullRequest = {
      title: pr.title,
      url: pr.url,
      number: pr.number,
      repository: pr.repository.name,
      author: pr.author.login,
      build: null,
      mergeStatus: pr.mergeable,
      latestParentCommit: true, // TODO
      freshComments: getNumFreshComments(pr.reviewThreads.nodes),
      approvals: getApprovals(pr.reviews.nodes)
    }

    // Some Pull Requests do not have a build (e.g. Infra PRs)
    if(pr.commits.nodes[0].commit.status){
      transFormedPullRequest.build = {
        status: pr.commits.nodes[0].commit.status.state,
        url: pr.commits.nodes[0].commit.status.contexts[0].targetUrl, 
      }
    }

    return transFormedPullRequest
  })

  return sortPullRequests(transformedPullRequests)
}

const getApprovals = reviews => {
  const approvals = reviews.filter((review) => {
    return review.state === 'APPROVED'
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
    const transFormedPullRequest = {
      title: pr.node.title,
      author: pr.node.author.login,
      number: pr.node.number,
      url: pr.node.url,
      repository: pr.node.repository,
      staleComments: getStaleComments(pr.node),
      mergeStatus: pr.node.mergeable,
      build: null,
    }

    
    
    // Some Pull Requests do not have a build (e.g. Infra PRs)
    if(pr.node.commits.nodes[0].commit.status){
      transFormedPullRequest.build = {
        status: pr.node.commits.nodes[0].commit.status.state,
        url: pr.node.commits.nodes[0].commit.status.contexts[0].targetUrl, 
      }
    }
    
    return transFormedPullRequest
  })

  return sortPullRequests(transformedPullRequests)
}

const getStaleComments = (pr) => {
  const staleComments = pr.reviewThreads.nodes.filter(reviewThread => {
    const author = reviewThread.comments.nodes[0].author.login

    return author === GITHUB_USERNAME && !reviewThread.isOutdated && !reviewThread.isResolved
  })

  return staleComments.length
}
import requests
import json




def scrape_solution_article(topic_id):
    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en-IN;q=0.9,en;q=0.8,id;q=0.7",
        "authorization": "",
        "content-type": "application/json",
        "dnt": "1",
        "origin": "https://leetcode.com",
        "priority": "u=1, i",
        "random-uuid": "b46a2c75-b46b-9ec8-281e-166460d7e4ae",
        "referer": f"https://leetcode.com/problems/{topic_id}/solutions/",
    }
    
    query = """
    
    query ugcArticleSolutionArticle($articleId: ID, $topicId: ID) {
  ugcArticleSolutionArticle(articleId: $articleId, topicId: $topicId) {
    content
    isSerialized
    isArticleReviewer
    scoreInfo {
      scoreCoefficient
    }
    prev {
      uuid
      slug
      topicId
      title
    }
    next {
      uuid
      slug
      topicId
      title
    }
  }
}
    
  
    
    """
    
    payload = {
        "query": query,
        "variables": {
            "topicId": str(topic_id)
        }
    }
    
    response = requests.post(
        "https://leetcode.com/graphql/",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        res= response.json()
        res=res["data"]["ugcArticleSolutionArticle"]["content"]
  
        return res
    else:
        print(f"Error: {response.status_code}")
        raise Exception(f"Failed to fetch solution article for topic ID {topic_id}")

def scrape_website(question_slug):
    
    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en-IN;q=0.9,en;q=0.8,id;q=0.7",
        "authorization": "",
        "content-type": "application/json",
        "dnt": "1",
        "origin": "https://leetcode.com",
        "priority": "u=1, i",
        "referer": f"https://leetcode.com/problems/{question_slug}/solutions",
    }

    query = """
    query ugcArticleSolutionArticles($questionSlug: String!, $orderBy: ArticleOrderByEnum, $userInput: String, $tagSlugs: [String!], $skip: Int, $before: String, $after: String, $first: Int, $last: Int, $isMine: Boolean) {
      ugcArticleSolutionArticles(
        questionSlug: $questionSlug
        orderBy: $orderBy
        userInput: $userInput
        tagSlugs: $tagSlugs
        skip: $skip
        first: $first
        before: $before
        after: $after
        last: $last
        isMine: $isMine
      ) {
        totalNum
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            ...ugcSolutionArticleFragment
          }
        }
      }
    }
    
    fragment ugcSolutionArticleFragment on SolutionArticleNode {
      uuid
      title
      slug
      summary
      author {
        realName
        userAvatar
        userSlug
        userName
        nameColor
        certificationLevel
        activeBadge {
          icon
          displayName
        }
      }
      articleType
      thumbnail
      summary
      createdAt
      updatedAt
      status
      isLeetcode
      canSee
      canEdit
      isMyFavorite
      chargeType
      myReactionType
      topicId
      hitCount
      hasVideoArticle
      reactions {
        count
        reactionType
      }
      title
      slug
      tags {
        name
        slug
        tagType
      }
      topic {
        id
        topLevelCommentCount
      }
    }
    
  
    """
    payload = {
        "query": query,
        "variables": {
            "questionSlug": question_slug,
            "skip": 0,
            "first": 15,
            "orderBy": "MOST_VOTES",
            "userInput": "",
            "tagSlugs": []
        }
    }

    response = requests.post(
        "https://leetcode.com/graphql/",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        raise Exception(f"Failed to fetch data for {question_slug}")


def get_question(question_slug):

    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en-IN;q=0.9,en;q=0.8,id;q=0.7",
        "authorization": "",
        "content-type": "application/json",
        "dnt": "1",
        "origin": "https://leetcode.com",
        "referer": f"https://leetcode.com/problems/{question_slug}/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0"
    }

    query = """
    query questionContent($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        content
        translatedTitle
        translatedContent
        difficulty
        codeSnippets {
          lang
          langSlug
          code
        }
        hints
        topicTags {
          name
          slug
        }
      }
    }
    """

    payload = {
        "query": query,
        "variables": {
            "titleSlug": question_slug
        }
    }

    response = requests.post(
        "https://leetcode.com/graphql",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        raise Exception(f"Failed to fetch problem via GraphQL: {response.status_code}")

    data = response.json()
    
    if "data" in data and "question" in data["data"]:
        question_data = data["data"]["question"]
        return {
            "title": question_data.get("title", ""),
            "content": question_data.get("content", ""),
            "difficulty": question_data.get("difficulty", ""),
            "slug": question_slug
        }
    else:
        raise Exception("Failed to extract problem data from GraphQL response")


def get_solutions(question_slug):
   
    result = scrape_website(question_slug=question_slug)
    question=get_question(question_slug)
    solutions = result["data"]["ugcArticleSolutionArticles"]["edges"]
   
    top_solution_data = []
    solution_contents = []

    for i in range(1,min(len(solutions), 3)):
        solution = solutions[i]
        topic_id = solution["node"]["topicId"]
 
        solution_data = scrape_solution_article(topic_id)
        top_solution_data.append(solution_data)

    return {"leetcode_problem":question,"submitted_solutions":top_solution_data}


# res=get_solutions(question_slug="longest-substring-without-repeating-characters")



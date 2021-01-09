/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getApplicantProfileN = /* GraphQL */ `
  query GetApplicantProfileN($userName: String!) {
    getApplicantProfileN(userName: $userName) {
      id
      email
      userName
      name
      yOe
      caFocus
      payOpt
      gender
      appStatus
      resume {
        bucket
        region
        key
      }
      employer
      comments {
        items {
          id
          candidateID
          comment
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listApplicantProfileNs = /* GraphQL */ `
  query ListApplicantProfileNs(
    $userName: String
    $filter: ModelApplicantProfileNFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listApplicantProfileNs(
      userName: $userName
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        email
        userName
        name
        yOe
        caFocus
        payOpt
        gender
        appStatus
        resume {
          bucket
          region
          key
        }
        employer
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRecuriterCommentN = /* GraphQL */ `
  query GetRecuriterCommentN($id: ID!) {
    getRecuriterCommentN(id: $id) {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;
export const listRecuriterCommentNs = /* GraphQL */ `
  query ListRecuriterCommentNs(
    $filter: ModelRecuriterCommentNFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecuriterCommentNs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        candidateID
        comment
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

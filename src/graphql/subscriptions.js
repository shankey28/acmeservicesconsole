/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateApplicantProfileN = /* GraphQL */ `
  subscription OnCreateApplicantProfileN {
    onCreateApplicantProfileN {
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
export const onUpdateApplicantProfileN = /* GraphQL */ `
  subscription OnUpdateApplicantProfileN {
    onUpdateApplicantProfileN {
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
export const onDeleteApplicantProfileN = /* GraphQL */ `
  subscription OnDeleteApplicantProfileN {
    onDeleteApplicantProfileN {
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
export const onCreateRecuriterCommentN = /* GraphQL */ `
  subscription OnCreateRecuriterCommentN {
    onCreateRecuriterCommentN {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRecuriterCommentN = /* GraphQL */ `
  subscription OnUpdateRecuriterCommentN {
    onUpdateRecuriterCommentN {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRecuriterCommentN = /* GraphQL */ `
  subscription OnDeleteRecuriterCommentN {
    onDeleteRecuriterCommentN {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;

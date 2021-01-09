/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createApplicantProfileN = /* GraphQL */ `
  mutation CreateApplicantProfileN(
    $input: CreateApplicantProfileNInput!
    $condition: ModelApplicantProfileNConditionInput
  ) {
    createApplicantProfileN(input: $input, condition: $condition) {
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
export const updateApplicantProfileN = /* GraphQL */ `
  mutation UpdateApplicantProfileN(
    $input: UpdateApplicantProfileNInput!
    $condition: ModelApplicantProfileNConditionInput
  ) {
    updateApplicantProfileN(input: $input, condition: $condition) {
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
export const deleteApplicantProfileN = /* GraphQL */ `
  mutation DeleteApplicantProfileN(
    $input: DeleteApplicantProfileNInput!
    $condition: ModelApplicantProfileNConditionInput
  ) {
    deleteApplicantProfileN(input: $input, condition: $condition) {
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
export const createRecuriterCommentN = /* GraphQL */ `
  mutation CreateRecuriterCommentN(
    $input: CreateRecuriterCommentNInput!
    $condition: ModelRecuriterCommentNConditionInput
  ) {
    createRecuriterCommentN(input: $input, condition: $condition) {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;
export const updateRecuriterCommentN = /* GraphQL */ `
  mutation UpdateRecuriterCommentN(
    $input: UpdateRecuriterCommentNInput!
    $condition: ModelRecuriterCommentNConditionInput
  ) {
    updateRecuriterCommentN(input: $input, condition: $condition) {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;
export const deleteRecuriterCommentN = /* GraphQL */ `
  mutation DeleteRecuriterCommentN(
    $input: DeleteRecuriterCommentNInput!
    $condition: ModelRecuriterCommentNConditionInput
  ) {
    deleteRecuriterCommentN(input: $input, condition: $condition) {
      id
      candidateID
      comment
      createdAt
      updatedAt
    }
  }
`;

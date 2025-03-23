import { ForbiddenException } from '@nestjs/common';

export const transformUserResponse = (user: any) => {
  return {
    ...user,
    hotel: user?.branch?.hotel,
    branch: { ...user?.branch, hotel: undefined }
  };
};

// TOOD: find a better approach to use authentication
/* This function basically handles authentication policy for user branch. */
export const matchUserBranchWithEntity = (user: any, entityBranchId: number) => {
  if (user.branchId !== entityBranchId) {
    throw new ForbiddenException('Access Denied: You do not have permission to modify this entity.');
  }
};

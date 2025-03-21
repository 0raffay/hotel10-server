export const transformUserResponse = (user: any) => {
  return {
    ...user,
    hotel: user?.branch?.hotel,
    branch: { ...user?.branch, hotel: undefined }
  };
};

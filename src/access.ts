export default (initialState: API.UserInfo) => {
  return {
    canEdit: initialState.role === 'admin',
    canDelete: initialState.role === 'admin',
    canCreate: initialState.role === 'admin',
  };
};

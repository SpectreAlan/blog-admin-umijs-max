export default (initialState: User.AccountInfo) => {
  return {
    canEdit: initialState.role === 'admin',
    canDelete: initialState.role === 'admin',
    canCreate: initialState.role === 'admin',
  };
};

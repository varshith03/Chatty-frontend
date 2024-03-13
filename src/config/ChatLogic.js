export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name; // Leave the user which is logged in and return the not logged-in user
};

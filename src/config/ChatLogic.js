export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name; // Leave the user which is logged in and return the not logged-in user
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0]; // same like above but retail all detils
};

export const isSamePerson = (messages, currentMessage, index, userID) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== currentMessage.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender?._id !== userID
  );
};

export const isLastMessage = (messages, index, userID) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userID &&
    messages[messages.length - 1].sender._id !== undefined
  );
};

export const senderMargin = (messages, currentMessage, index, userID) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === currentMessage.sender._id &&
    messages[index].sender._id !== userID
  )
    return 35;
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== currentMessage.sender._id &&
      messages[index].sender._id !== userID) ||
    (index === messages.length - 1 && messages[index].sender._id !== userID)
  )
    return 0;
  else return "auto";
};

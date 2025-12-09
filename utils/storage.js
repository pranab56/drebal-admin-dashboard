export const saveToken = (token) => {
  localStorage.setItem("drebalAdmin", token);
};

export const getToken = () => {
  return localStorage.getItem("drebalAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("drebalAdmin");
};

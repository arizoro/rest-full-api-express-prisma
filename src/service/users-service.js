import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/users-validation.js";
import { RessponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new RessponseError(400, "username already axist");
  }

  user.password = await bcrypt.hash(user.password, 10);
  console.log(user.image)
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
      image: true
    },
  });
};

const loginUser = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new RessponseError(401, "Username or password wrong !!");
  }

  const passwordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!passwordValid) {
    throw new RessponseError(401, "Username or password wrong !!");
  }

  const token = uuid().toString();

  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const getUser = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      image : true
    }
  });

  if (!user) {
    throw new RessponseError(404, "User is not found");
  }

  return user;
};

const updateUser = async (request) => {
  const user = validate(updateUserValidation, request);

  const userInDatabase = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });


  if (userInDatabase !== 1) {
    throw new RessponseError(404, "User not found");
  }

  const data = {};

  if (user.username) {
    data.name = user.name;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  if(user.image){
    data.image = user.image
  }

  const result = await prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
      image : true
    },
  });

  return result
};

const logout = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new RessponseError(404, "User not found");
  }

  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  loginUser,
  getUser,
  updateUser,
  logout,
};

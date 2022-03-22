import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {API_URL, recipeApi} from "../api/recipeApi";
import axios from "axios";

const defaultState = {
  isAuth: false,
  loginUser: {},
  redirectTo: null,
  catalog: [],
  suggestion_tags: [],
  suggestion_ingredients: [],
  tagsFull: [],
  ingredientsFull: []

}

const ADD_RECIPE = 'ADD_RECIPE'
const SET_CATALOG = "SET_CATALOG"
const SET_RECIPE = "SET_RECIPE"
const DELETE_RECIPE = "DELETE_RECIPE"
const SET_LOGIN_USER = "SET_LOGIN_USER"
const SET_USERS = "SET_USERS"
const SET_AUTH = "SET_AUTH"
const SET_ONE_USER = "SET_ONE_USER"
const SET_REDIRECT_TO = "SET_REDIRECT_TO"
const SET_SUGGESTION_TAGS = "SET_SUGGESTION_TAGS"
const SET_SUGGESTION_INGREDIENTS = "SET_SUGGESTION_INGREDIENTS"
const SET_TAGS_FULL = "SET_TAGS_FULL"
const SET_INGREDIENTS_FULL = "SET_INGREDIENTS_FULL"
const DELETE_INGREDIENT_FULL = "DELETE_INGREDIENT_FULL"
const DELETE_TAG_FULL = "DELETE_TAG_FULL"


const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_RECIPE:
      return {...state, catalog: state.catalog.concat([action.payload])}
    case SET_CATALOG:
      return {...state, catalog: action.payload}
    case SET_RECIPE:
      return {...state, recipe: action.payload}
    case DELETE_RECIPE:
      return {...state, catalog: state.catalog.filter(recipe => recipe._id !== action.payload._id)}
    case SET_LOGIN_USER:
      return {...state, loginUser: action.payload}
    case SET_USERS:
      return {...state, users: action.payload}
    case SET_AUTH:
      return {...state, isAuth: action.payload}
    case SET_ONE_USER:
      return {...state, user: action.payload}
    case SET_REDIRECT_TO:
      return {...state, redirectTo: action.payload}
    case SET_SUGGESTION_TAGS:
      return {...state, suggestion_tags: action.payload}
    case SET_SUGGESTION_INGREDIENTS:
      return {...state, suggestion_ingredients: action.payload}
    case SET_TAGS_FULL:
      return {...state, tagsFull: action.payload}
    case SET_INGREDIENTS_FULL:
      return {...state, ingredientsFull: action.payload}
    case DELETE_INGREDIENT_FULL:
      return {
        ...state,
        ingredientsFull: state.ingredientsFull.filter(ing => ing._id !== action.payload._id)
      }
    case DELETE_TAG_FULL:
      return {
        ...state,
        tagsFull: state.tagsFull.filter(tag => tag._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const setCatalog = (catalog) => ({type: SET_CATALOG, "payload": catalog})
export const setRecipe = (recipe) => ({type: SET_RECIPE, "payload": recipe})
export const deleteRecipeAction = (recipe) => ({type: DELETE_RECIPE, "payload": recipe})
export const addRecipe = (recipe) => ({type: ADD_RECIPE, "payload": recipe})

export const setRedirect = (redirectUrl) => ({type: SET_REDIRECT_TO, "payload": redirectUrl})

export const setUser = (loginUser) => ({type: SET_LOGIN_USER, "payload": loginUser})

export const setUsers = (users) => ({type: SET_USERS, "payload": users})
export const setOneUser = (user) => ({type: SET_ONE_USER, "payload": user})
export const setAuth = (isAuth) => ({type: SET_AUTH, "payload": isAuth})
export const setSuggestionTags = (tags) => ({type: SET_SUGGESTION_TAGS, "payload": tags})
export const setSuggestionIngredients = (ingredients) => ({type: SET_SUGGESTION_INGREDIENTS, "payload": ingredients})
export const setTagsFull = (tagsFull) => ({type: SET_TAGS_FULL, "payload": tagsFull})
export const setIngredientsFull = (ingredientsFull) => ({type: SET_INGREDIENTS_FULL, "payload": ingredientsFull})


export const deleteIngredientAction = (ingredient) => ({type: DELETE_INGREDIENT_FULL, "payload": ingredient})
export const deleteTagAction = (tag) => ({type: DELETE_TAG_FULL, "payload": tag})

export function getRecipe(recipeId) {
  return async dispatch => {
    const recipe = await recipeApi.getRecipe(recipeId)
    dispatch(setRecipe(recipe))
  }
}

export function getCatalog() {
  return async dispatch => {
    const catalog = await recipeApi.getCatalog()
    dispatch(setCatalog(catalog))
  }
}

export function sendRecipeThunk(recipe, isUpdate) {
  return async dispatch => {
    const newRecipe = await recipeApi.sendRecipe(recipe, isUpdate)
    if (newRecipe && newRecipe._id) {
      // dispatch(addRecipe(newRecipe))
      dispatch(setRedirect(`/recipe/${newRecipe._id}`))
    }
  }
}

export function deleteRecipe(recipe) {
  return async dispatch => {
    const response = await recipeApi.deleteRecipe(recipe);
    if (response) {
      const {data: deletedRecipe} = response;
      dispatch(deleteRecipeAction(deletedRecipe))
    }
  }
}

export function deleteIngredient(ingredient) {
  return async dispatch => {
    const response = await recipeApi.deleteIngredient(ingredient);
    if (response) {
      const {data: deletedIngredient} = response;
      dispatch(deleteIngredientAction(deletedIngredient))
    }
  }
}

export function deleteTag(tag) {
  return async dispatch => {
    const response = await recipeApi.deleteTag(tag);
    if (response) {
      const {data: deletedTag} = response;
      dispatch(deleteTagAction(deletedTag))
    }
  }
}

export function addToFavourite(recipeId) {
  //TODO CHANGE "FAVOURITED BY" AND CHANGE "ADD TO FAVOURITE" BUTTON TEXT
  return async dispatch => {
    const response = await recipeApi.addToFavourite(recipeId);
    if (response) {
      // all good :)
    }
  }
}

export function sendUserRegister(nickname, password) {
  return async dispatch => {
    const userData = await recipeApi.sendUserRegister({nickname, password})
    if (userData) {
      localStorage.setItem('accessToken', userData.accessToken)
      dispatch(setAuth(true))
      dispatch(setUser(userData.loginUser))
    }
  }
}


export function sendUserLogin(nickname, password) {
  return async dispatch => {
    const userData = await recipeApi.sendUserLogin({nickname, password})
    if (userData) {
      localStorage.setItem('accessToken', userData.accessToken)
      dispatch(setAuth(true))
      dispatch(setUser(userData.loginUser))
    }
  }
}

export function sendChangePassword(password, newPassword) {
  return async dispatch => {
    const userData = await recipeApi.sendChangePassword({password, newPassword})
    if (userData) {
      localStorage.setItem('accessToken', userData.accessToken)
      dispatch(setAuth(true))
      dispatch(setUser(userData.loginUser))
    }
  }
}

export function getUsers() {
  return async dispatch => {
    const users = await recipeApi.getUsers()
    if (users) {
      dispatch(setUsers(users))
    }
  }
}

export function getOneUser(userId) {
  return async dispatch => {
    const user = await recipeApi.getOneUser(userId)
    if (user) {
      dispatch(setOneUser(user))
    }
  }
}

export function logout() {
  return async dispatch => {
    const response = await recipeApi.logout()
    if (response) {
      localStorage.removeItem('accessToken')
      dispatch(setAuth(false))
      dispatch(setUser({}))
    }
  }
}

export function checkAuth() {
  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})

      localStorage.setItem('accessToken', response.data.accessToken)
      dispatch(setAuth(true))
      dispatch(setUser(response.data.loginUser))
    } catch (e) {
      console.log("checkAuth error: ", e?.response?.data?.message)
      localStorage.removeItem('accessToken')
      dispatch(setAuth(false))
    }
  }
}

export function getSuggestionTags() {
  return async dispatch => {
    const tags = await recipeApi.getSuggestionTags()
    if (tags) {
      const tags_with_ids = tags.data.map(tag => {return {"id": tag._id, "name": tag.name}})
      dispatch(setSuggestionTags(tags_with_ids))
    }
  }
}

export function getSuggestionIngredients() {
  return async dispatch => {
    const ingredients = await recipeApi.getSuggestionIngredients()
    if (ingredients) {
      const ingredients_with_ids = ingredients.data.map(ingredient => ({
          "id": ingredient._id,
          "name": ingredient.name
        })
      )
      dispatch(setSuggestionIngredients(ingredients_with_ids))
    }
  }
}

export function getTagsIngredientsFull() {
  return async dispatch => {
    const {tags: tagsFull, ingredients: ingredientsFull} = await recipeApi.getTagsIngredientsFull()
    if (tagsFull && ingredientsFull) {
      dispatch(setTagsFull(tagsFull))
      dispatch(setIngredientsFull(ingredientsFull))
    }
  }
}


export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
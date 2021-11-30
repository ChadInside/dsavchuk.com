const axios = require("axios")
export const API_URL = 'http://localhost:5001/api/recipes'


const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
  return config
})


instance.interceptors.response.use(config => {
  return config
}, async error => {
  // console.log("my interceptor error: ", error?.response)
  const originalRequest = error.config
  if (error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
      localStorage.setItem('accessToken', response.data.accessToken)
      return instance.request(originalRequest)
    } catch (e) {
      console.log("my interceptor error catch: ", e)
      // throw e;
      return null
    }
  }

// throw error
})


export const recipeApi = {
  getCatalog() {
    return instance.get("all/").then(({data}) => {return data})
  },
  getRecipe(recipeId) {
    return instance.get("recipe/" + recipeId).then(response => {
      return response?.data
    }).catch(e => {
        console.log("api error catch: ", e?.response)
        return null;
      }
    )
  },
  sendRecipe(recipe, isUpdate) {
    if (!isUpdate) {
      return instance.post("new-recipe/", recipe).then(({data}) => {return data}).catch(e => {
        console.log("api error send : ", e?.response);
        return null
      })
    } else if (isUpdate) {
      return instance.put("new-recipe/" + recipe["_id"], recipe).then(({data}) => {return data}).catch(e => {
        console.log("api error send patch : ", e?.response);
        return null
      })
    }
  },
  deleteRecipe(recipeId) {
    return instance.delete("recipe/" + recipeId).then(response => {return response}).catch(e => {
      console.log("api error catch delete: ", e?.response);
      return null
    })
  },
  addToFavourite(recipeId) {
    return instance.post("recipe/favourite/" + recipeId).then(response => {return response}).catch(e => {
      console.log("api error catch favourite: ", e?.response);
      return null
    })
  },
  sendUserRegister(user) {
    return instance.post("registration/", user).then(response => {return response.data}).catch(e => {
      console.log("api error catch register: ", e?.response);
      return null
    })
  },
  sendUserLogin(user) {
    return instance.post("login/", user).then(response => {return response.data}).catch(e => {
      console.log("api error catch login: ", e?.response);
      return null
    })
  },
  getUsers() {
    return instance.get("users/all").then(response => {return response.data}).catch(e => {
      console.log("api error catch getUsers: ", e?.response);
      // return null
      throw e
    })
  },
  getOneUser(userId) {
    return instance.get("user/" + userId).then(response => {return response.data}).catch(e => {
      console.log("api error catch getOneUser: ", e?.response);
      return null
    })
  },
  logout() {
    return instance.post("logout/").then(response => {return response}).catch(e => {
      console.log("api error catch logout: ", e?.response);
      return null
    })
  },
  getSuggestionTags() {
    return instance.get("tags/").then(response => {return response}).catch(e => {
      console.log("api error catch tags: ", e?.response);
      return null
    })
  },
  getSuggestionIngredients() {
    return instance.get("ingredients/").then(response => {return response}).catch(e => {
      console.log("api error catch ingredients: ", e?.response);
      return null
    })
  },

}
import CatalogPage from "./components/Pages/CatalogPage";
import RecipePage from "./components/Pages/RecipePage";
import AuthPage from "./components/Pages/AuthPage";
import UserPage from "./components/Pages/UserPage";
import CreateRecipePage from "./components/Pages/CreateRecipePage";
import TagsIngredientsPage from "./components/Pages/TagsIngredientsPage";

const MAIN_PAGE = "/"
const AUTH_PAGE = "/auth"
const RECIPE_PAGE = "/recipe"
const USER_PAGE = "/user"
const CREATE_RECIPE_PAGE = "/new-recipe"
const TAGS_INGREDIENTS_PAGE = "/tags-ingredients"


export const Routes = [
  {
    path: MAIN_PAGE,
    Component: CatalogPage
  },
  {
    path: AUTH_PAGE,
    Component: AuthPage
  },
  {
    path: TAGS_INGREDIENTS_PAGE,
    Component: TagsIngredientsPage
  },
  {
    path: CREATE_RECIPE_PAGE,
    Component: CreateRecipePage
  },
  {
    path: CREATE_RECIPE_PAGE + '/:id',
    Component: CreateRecipePage
  },
  {
    path: RECIPE_PAGE + '/:id',
    Component: RecipePage
  },
  {
    path: USER_PAGE + '/:id',
    Component: UserPage
  },
]
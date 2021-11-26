module.exports = class UserDto {
  nickname;
  id;
  roles;

  constructor(model) {
    this.nickname = model.nickname;
    this.id = model._id;
    this.roles = model.roles;
  }


}
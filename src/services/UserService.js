import backend from "@/backend";
  
class UserService {
  static getUserInfo(token) {
    return backend.post('/api/v1/user/info', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static createUser(user, token) {
    return backend.post('/api/v1/user', user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static register(data, token) {
    return backend.post('/api/v1/user/register', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static modifyProfile(data, token) {
    return backend.patch('/api/v1/user/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default UserService
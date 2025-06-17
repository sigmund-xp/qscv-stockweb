import backend from "@/backend";

class AuthService {

  static login(usuario) {
    return backend.post('/api/v1/auth/login', usuario)
  }

  static logout(token) {
    return backend.get('/api/v1/auth/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static refreshToken() {
    return backend.get('/api/v1/auth/refresh')
  }

}

export default AuthService
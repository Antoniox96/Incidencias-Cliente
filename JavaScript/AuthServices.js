angular.module("AppIncidencias")
	.factory('AuthenticationService', function() {
		var auth = {
			isLogged: false
		}
	  
		return auth;
	})

	.factory('UserService', function($http) {
		return {
			LogIn: function(username, password) {
				return $http.post('/auth/local', {identifier: username, password: password});
			},
	 
			LogOut: function() {
	 
			}
		}
	})

	.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
		return {
			request: function (config) {
				console.log("TEST");
				config.headers = config.headers || {};

				if ( $window.sessionStorage.token ) {
				 	config.headers.Authorization = 'Incidencias ' + $window.sessionStorage.token;
				}

				return config;
			},

			requestError: function(rejection) {
				return $q.reject(rejection);
			},

			response: function (response) {
				if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
					AuthenticationService.isAuthenticated = true;
				}
				return response || $q.when(response);
			},

			responseError: function(rejection) {
				if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
					delete $window.sessionStorage.token;
					AuthenticationService.isAuthenticated = false;
					$location.path("/login");
				}

				return $q.reject(rejection);
			}
		};
	});
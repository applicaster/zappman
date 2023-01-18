export const requests: any = {
    items: [
        {
            info: {
                id: 'contentFeed',
                type: 'request',
                label: "Feed",
            },
            requests: [
                {
                    id: 'contentFeed',
                    label: 'Content Feed',
                },
            ]
        },
        {
            info: {
                id: 'loginFlow',
                type: 'folder',
                label: 'Login Flow Requests',
            },
            requests: [
                {
                    id: 'login',
                    label: 'Login',
                },
                {
                    id: 'register',
                    label: 'Register',
                },
                {
                    id: 'refreshToken',
                    label: 'Refresh Token',
                },
                {
                    id: 'resetPassword',
                    label: 'Reset Password',
                },
                {
                    id: 'deleteAccount',
                    label: 'Delete Account',
                },
            ]
        }
    ]
}
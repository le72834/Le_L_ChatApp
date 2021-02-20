import ChatMessage from "./components/TheMessageComponent.js";


(() => {
    console.log('fired');
    

    //load the socket library and make connection
    const socket = io();

    //messenger service event handling -> incoming from the manager
    function setUserId({sID}){
        //incoming connected event with data
        //debugger;
        vm.socketID = sID;
        console.log(sID, 'joined the chat');
    
    }

    function showConnect(packet){
        console.log(packet);
    }
    function appendMessage(msg){
        //debugger;
        vm.messages.push(msg);
    }
    

    const vm = new Vue({
        data: {
            messages: [],
            nickname: "",
            username: "",
            socketID: "",
            message: "",
            typing: false,
            ready: false,
            info: []
            
        }, 
        
        created: function(){
            console.log('its alive');
            
            socket.on('typing', (data) => {
                this.typing = data;
            })

            socket.on('stopTyping', () => {
                this.typing = false;
            })

            // window.onbeforeunload = () => {
            //     socket.emit('leave', this.nickname);
            // }

            // socket.on('chatmessage', (data) => {
            //     this.messages.push({
            //         message: data.message,
            //         type: 1,
            //         name: data.name,
            //     });
            // });

            // socket.on('joined', (data) => {
            //     this.info.push({
            //         nickname: data,
            //         type: 'joined'
            //     });

            //     setTimeout(() => {
            //         this.info = [];
            //     }, 5000);
            // });
            // socket.on('leave', (data) => {
            //     this.info.push({
            //         nickname: data,
            //         type: 'left'
            //     });

            //     setTimeout(() => {
            //         this.info = [];
            //     }, 5000);
            // });

        },
        watch: {
            message(value) {
                value ? socket.emit('typing', this.nickname || "anonymous") : socket.emit('stopTyping')
            }
        },

        methods: {
            dispatchMessage() {
                // this.messages.push({
                //     content: this.message,
                //     type: 0,
                //     name: 'Me',
                // });
                //debugger;
                socket.emit('chatmessage', { 
                content: this.message, 
                name: this.nickname || "Anonymous"});

                this.message = "";
            },
            
            addUser() {
                this.ready = true,
                socket.emit('user-connect',this.nickname);
               
            }  
            

        },
        components: {
            newmessage: ChatMessage
        }
    }).$mount("#app");

    socket.addEventListener('connected', setUserId);
    socket.addEventListener('message', appendMessage);
    socket.addEventListener('userconnect', showConnect );
    socket.addEventListener('userdisconnect', showConnect );
})();
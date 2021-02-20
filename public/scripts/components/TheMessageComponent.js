export default{
    props: ['msg', 'socketid'],

    template: `<div class="new-message" :class="{ 'my-message' : matchedID }">
        <h4>{{msg.message.name}}</h4>
        <p>{{msg.message.content}}</p>
    </div>`,

    data: function(){
        return {
            matchedID: this.socketid == this.msg.id
        }
    }
}
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace WebSignalR.Hubs
{
    public class ChatHub : Hub
    {
        public static IDictionary<string, string> hashUser = new Dictionary<string, string>();
        public async Task EnviarMensagem(string usuario, string mensagem)
        {
            var teste = hashUser.Keys.FirstOrDefault(p => p == this.Context.ConnectionId);
            if (teste == null)
                await AddNewUser(usuario);

            await Clients.All.SendAsync("ReceberMensagem", usuario, mensagem);
        }

        public async Task AddNewUser(string name)
        {
            hashUser.Add(this.Context.ConnectionId, name);
            await Clients.All.SendAsync("NewUserAdd", name);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = hashUser[this.Context.ConnectionId];
            await Clients.All.SendAsync("UserDesconnected", user);
        }
    }
}

import React, { FormEvent, useState, useEffect } from "react";
import axios from 'axios';
import "./style.css"; // Importação do CSS
import SimplePopup2 from "../pop2";

const Home = () => {
  const [pedido, setPedido] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<number | null>(null); // Estado para armazenar o ID do usuário
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Recupera informações do usuário do localStorage ao carregar a página
    const authenticatedUser = localStorage.getItem('authenticatedUser');
    if (authenticatedUser) {
      const parsedUser = JSON.parse(authenticatedUser);
      setUsuario(parsedUser.id); // Define o ID do usuário no estado
    }
  }, []);

  async function getCurrentStatus(pedido: number | null) {
    if (pedido === null) return 0;

    try {
      const response = await axios.get('http://192.168.252.253:3001/atualizar-status', {
        params: { pedidoNumero: pedido, status: 100, usuario }
      });
      return response.data.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        setStatus(`Erro ao obter status: ${error.message}`);
      } else {
        console.error('Erro inesperado:', error);
        setStatus(`Erro inesperado: ${error}`);
      }
      return 0;
    }
  }

  async function updatePedidoStatus(pedido: number | null, status: number, usuario: number) {
    if (pedido === null) return;

    try {
      const response = await axios.get('http://192.168.252.253:3001/atualizar-status', {
        params: {
          pedidoNumero: pedido,
          status: status,
          usuario: usuario
        }
      });

      console.log('Status atualizado:', response.data);
      setStatus(`Status do pedido atualizado: ${response.data}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar status:', error.message);
        setStatus(`Erro ao atualizar status: ${error.message}`);
      } else {
        console.error('Erro inesperado:', error);
        setStatus(`Erro inesperado: ${error}`);
      }
    }
  }

  const handleConsultarStatus = async () => {
    if (pedido === null) return;

    const currentStatus = await getCurrentStatus(pedido);
    setStatus(getStatusName(currentStatus));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    if (pedido === null) {
      return;
    }
    const currentStatus = await getCurrentStatus(pedido);
    if(currentStatus === 90 ){
      const novoStatus = 30;
      const novoStatusNome = getStatusName(novoStatus); // Obter o nome do novo status
    
      const confirmMessage = `O seu status é ${getStatusName(currentStatus)}. Você vai atualizar para ${novoStatusNome}.`;
      if (window.confirm(confirmMessage)) {
        await updatePedidoStatus(pedido, novoStatus, usuario || 0);
        setStatus(novoStatusNome); // Atualizar o estado de status com o nome do novo status
      }

    }else if(currentStatus === 30){
      const novoStatus = 50;
      const novoStatusNome = getStatusName(novoStatus); // Obter o nome do novo status
    
      const confirmMessage = `O seu status é ${getStatusName(currentStatus)}. Você vai atualizar para ${novoStatusNome}.`;
      if (window.confirm(confirmMessage)) {
        await updatePedidoStatus(pedido, 50, usuario || 0);
        setStatus(novoStatusNome); // Atualizar o estado de status com o nome do novo status
      }
    }  
    else{
      const novoStatus = calculateNextStatus(currentStatus);
      const novoStatusNome = getStatusName(novoStatus); // Obter o nome do novo status
    
      const confirmMessage = `O seu status é ${getStatusName(currentStatus)}. Você vai atualizar para ${novoStatusNome}.`;
      if (window.confirm(confirmMessage)) {
        await updatePedidoStatus(pedido, novoStatus, usuario || 0);
        setStatus(novoStatusNome); // Atualizar o estado de status com o nome do novo status
      }
    }
 
  };

  const handleSubmit90 = async (event: FormEvent) => {
    event.preventDefault();
  
    if (pedido === null) return;
  
    const currentStatus = await getCurrentStatus(pedido);
    const novoStatus = 90;
    const novoStatusNome = getStatusName(novoStatus); // Obter o nome do novo status
  
    const confirmMessage = `O seu status é ${getStatusName(currentStatus)}. Você vai atualizar para ${novoStatusNome}.`;
    if (window.confirm(confirmMessage)) {
      await updatePedidoStatus(pedido, novoStatus, usuario || 0);
      setStatus(novoStatusNome); // Atualizar o estado de status com o nome do novo status
    }
  };
  

  const calculateNextStatus = (currentStatus: number) => {
    return currentStatus >= 90 ? 0 : currentStatus + 10;
  };

  const getStatusName = (statusCode: number | string) => {
    const statusArray = [
      { codigo: 0, nome: "Em liberação" },
      { codigo: 10, nome: "Para Separação" },
      { codigo: 20, nome: "Separando" },
      { codigo: 30, nome: "Em conferência" },
      { codigo: 40, nome: "Conferido" },
      { codigo: 50, nome: "Liberado Faturamento" },
      { codigo: 60, nome: "Faturado" },
      { codigo: 90, nome: "Item pendente" }
    ];

    const statusObj = statusArray.find(status => status.codigo === statusCode);
    return statusObj ? statusObj.nome : '';
  };


  return (
    <main className="primary-section">
      <div className="Nav-Bar">
        <img className="Logo_kopermax" src="Logo KoperMax.png" alt="Logo KoperMax" />
      </div>

      <div className="secundary-container">
        <form className="Form" onSubmit={handleSubmit}>
        <select className="B"  required value={usuario !== null ? usuario.toString() : ''} onChange={(e) => setUsuario(Number(e.target.value))}>
            <option value="">Selecione o usuário</option>
            <option value="9">Felipe</option>
            <option value="93">Bruno</option>
            <option value="94">Jessica</option>
            <option value="95">Eduardo</option>
            <option value="96">Fernando</option>
            <option value="97">Kauanna</option>
            <option value="7">Dayane</option>
            <option value="76">Gustavo</option>
            <option value="91">Kauã SUP</option>

          </select>
          <div className="aolado">
            <div className="Forms-center1">
              <span className="Text1">Número Pedido</span>
              <input
                type=""
                className="CampoST"
                placeholder="Número Pedido"
                name="pedido"
                value={pedido !== null ? pedido : ''}
                onChange={(e) => setPedido(Number(e.target.value))}
                
              />
            </div>
          </div>
          <div className="Text1">Status do pedido: </div><div className="Status">{status}</div>
          <div className="ao1">
            <button type="submit" className="B">Novo Status</button>
            <button type="button" className="B" onClick={handleConsultarStatus}>Status Atual</button>
            <button type="button" className="B" onClick={handleSubmit90}>Item pendente</button>
          </div>
        </form>
      </div>

      <div className="Container_Feedback">
        <div className="Feedback">
         <SimplePopup2/>
        </div>
      </div>

      <div className="Footer">
        <div className="icon-img">
          <a href="https://www.linkedin.com/company/kopermax-do-brasil/?originalSubdomain=br" target="_blank" rel="noopener noreferrer">
            <img style={{ width: "30px", height: "30px", padding: "5px" }} src="Logo LinkedIn.png" alt="LinkedIn" />
          </a>
        </div>
        <div className="icon-img">
          <a href="https://www.instagram.com/kopermax.oficial/" target="_blank" rel="noopener noreferrer">
            <img style={{ width: "30px", height: "30px", padding: "5px" }} src="Logo Instagram.png" alt="Instagram" />
          </a>
        </div>
        <div className="icon-img">
          <a href="https://www.facebook.com/kopermax/?locale=pt_BR" target="_blank" rel="noopener noreferrer">
            <img style={{ width: "30px", height: "30px", padding: "5px" }} src="Logo Facebook.png" alt="Facebook" />
          </a>
        </div>
      </div>
    </main>
  );
};

export default Home;



/*   <form className="Form" onSubmit={handleSubmit}>
          <select   required value={usuario !== null ? usuario.toString() : ''} onChange={(e) => setUsuario(Number(e.target.value))}>
            <option value="">Selecione o usuário</option>
            <option value="9">Felipe</option>
            <option value="93">Bruno</option>
            <option value="94">Jessica</option>
            <option value="95">Eduardo</option>
            <option value="96">Fernando</option>
            <option value="97">Kauanna</option>
            <option value="7">Dayane</option>
            <option value="76">Gustavo</option>
            <option value="91">Kauã SUP</option>

          </select> */
import { useState } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [team, setTeam] = useState('');

  const [newName, setNewName] = useState('');
  const [newBirth, setNewBirth] = useState('');
  const [newTeam, setNewTeam] = useState('');

  const [personList, setPersonList] = useState([]);
  const [editId, setEditId] = useState(null);

  const startEditing = (id, currentName, currentBirth, currentTeam) => {
    setEditId(id);
    setNewName(currentName);
    const formattedDate = new Date(currentBirth).toISOString().split('T')[0];
    setNewBirth(formattedDate);
    setNewTeam(currentTeam);
  };

  const addPerson = () => {
    Axios.post('http://localhost:3001/create', {
      name: name,
      birth: birth,
      team: team,
    }).then(() => {
      setPersonList([
        ...personList,
        {
          name: name,
          birth: birth,
          team: team,
        },
      ]);
    });
  };

  const getPeople = () => {
    Axios.get('http://localhost:3001/fans').then((response) => {
      setPersonList(response.data);
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const updatePerson = (id) => {
    Axios.put('http://localhost:3001/update', {
      id: id,
      name: newName,
      birth: newBirth,
      team: newTeam,
    }).then(() => {
      setPersonList(
        personList.map((val) => {
          return val.id === id
            ? {
                id: val.id,
                name: newName,
                birth: newBirth,
                team: newTeam,
              }
            : val;
        })
      );
      setEditId(null);
    });
  };

  const deletePerson = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setPersonList(
        personList.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  return (
    <div className="App">
      <div>
        <h1>Cadastro de Torcedores</h1>
      </div>
      <div className="information">
        <label>Nome:</label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Data de Nascimento:</label>
        <input
          type="date"
          onChange={(event) => {
            setBirth(event.target.value);
          }}
        />
        <label>Time:</label>
        <input
          type="text"
          onChange={(event) => {
            setTeam(event.target.value);
          }}
        />
        <button onClick={addPerson}>Adicionar torcedor</button>
        <button onClick={getPeople}>Mostrar torcedores</button>
      </div>

      <div className="people">
        {personList.map((val) => {
          return (
            <div key={val.id} className="person-row">
              <div className="labels">
                <div>
                  <p>Nome: </p>
                  <span>{val.name}</span>
                </div>
                <div>
                  <p>Idade: </p>
                  <span>{calculateAge(val.birth)} anos</span>
                </div>
                <div>
                  <p>Time: </p>
                  <span>{val.team}</span>
                </div>
                <div className="person-actions">
                  <button onClick={() => startEditing(val.id, val.name, val.birth, val.team)}>
                    Editar
                  </button>
                  <button className="delete-button" onClick={() => deletePerson(val.id)}>
                    Deletar
                  </button>
                </div>
              </div>

              {editId === val.id && (
                <div className="edit-inputs">
                  <input
                    type="text"
                    value={newName}
                    onChange={(event) => {
                      setNewName(event.target.value);
                    }}
                  />
                  <input
                    type="date"
                    value={newBirth}
                    onChange={(event) => {
                      setNewBirth(event.target.value);
                    }}
                  />
                  <input
                    type="text"
                    value={newTeam}
                    onChange={(event) => {
                      setNewTeam(event.target.value);
                    }}
                  />
                  <button onClick={() => updatePerson(val.id)}>Confirmar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

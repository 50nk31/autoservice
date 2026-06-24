import { useState, useEffect, Fragment } from 'react';
import './style.css';

const API = 'http://localhost:3001/api';
const STATUSES = ['новый', 'в работе', 'готов', 'выдан'];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('services');
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [error, setError] = useState('');
  const [openOrder, setOpenOrder] = useState(null);

  const [authMode, setAuthMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [reg, setReg] = useState({ name: '', phone: '', password: '', car_brand: '', car_model: '', car_year: '', plate_number: '', vin: '' });

  const [orderClientId, setOrderClientId] = useState('');
  const [order, setOrder] = useState({ title: '', workCost: 0, parts: [], serviceId: '' });
  const [newPart, setNewPart] = useState({ name: '', article: '', price: '' });
  const [newClient, setNewClient] = useState({ name: '', phone: '', car_brand: '', car_model: '', car_year: '', plate_number: '', vin: '' });
  const [newService, setNewService] = useState({ category: '', name: '', price: '' });
  const [car, setCar] = useState({ car_brand: '', car_model: '', car_year: '', plate_number: '', vin: '' });

  const isStaff = user?.role === 'admin' || user?.role === 'master';
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isGuest = user?.role === 'guest';

  useEffect(() => {
    if (user) {
      setTab(isGuest ? 'services' : isStaff ? 'newOrder' : 'services');
      loadData();
    }
  }, [user]);

  async function loadData() {
    setError('');
    try {
      if (isGuest) {
        setServices(await (await fetch(`${API}/services`)).json());
        return;
      }
      const list = [fetch(`${API}/services`)];
      if (isStaff) list.push(fetch(`${API}/orders`), fetch(`${API}/clients`), fetch(`${API}/parts`));
      if (isClient) list.push(fetch(`${API}/orders?client_id=${user.id}`), fetch(`${API}/clients/${user.id}`), fetch(`${API}/parts`));

      const res = await Promise.all(list);
      setServices(await res[0].json());
      if (isStaff) {
        setOrders(await res[1].json());
        setClients(await res[2].json());
        setParts(await res[3].json());
      }
      if (isClient) {
        setOrders(await res[1].json());
        const me = await res[2].json();
        setParts(await res[3].json());
        setCar({ car_brand: me.car_brand || '', car_model: me.car_model || '', car_year: me.car_year || '', plate_number: me.plate_number || '', vin: me.vin || '' });
      }
    } catch {
      setError('Ошибка загрузки');
    }
  }

  async function doLogin(e) {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, password }) });
    if (res.ok) setUser(await res.json());
    else setError((await res.json()).error);
  }

  async function doRegister(e) {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...reg, car_year: reg.car_year ? Number(reg.car_year) : null }) });
    if (res.ok) setUser(await res.json());
    else setError((await res.json()).error);
  }

  function partsSum() {
    return order.parts.reduce((s, p) => s + p.price * p.quantity, 0);
  }

  function addServiceToOrder() {
    const s = services.find(x => x.id === Number(order.serviceId));
    if (!s) return;
    setOrder({
      title: order.title ? order.title + ', ' + s.name : s.name,
      workCost: order.workCost + Number(s.price),
      parts: order.parts,
      serviceId: '',
    });
  }

  function togglePart(p) {
    const exists = order.parts.find(x => x.part_id === p.id);
    if (exists) {
      setOrder({ ...order, parts: order.parts.filter(x => x.part_id !== p.id) });
    } else {
      setOrder({ ...order, parts: [...order.parts, { part_id: p.id, name: p.name, article: p.article, price: Number(p.price), quantity: 1 }] });
    }
  }

  async function createOrder(e) {
    e.preventDefault();
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: isClient ? user.id : Number(orderClientId),
        title: order.title,
        work_cost: order.workCost,
        parts: order.parts,
      }),
    });
    if (res.ok) {
      setOrder({ title: '', workCost: 0, parts: [], serviceId: '' });
      setOrderClientId('');
      loadData();
    } else {
      setError((await res.json()).error);
    }
  }

  function getTabs() {
    if (isGuest) return [{ id: 'services', label: 'Услуги' }];
    if (isClient) return [
      { id: 'services', label: 'Услуги' },
      { id: 'car', label: 'Автомобиль' },
      { id: 'newOrder', label: 'Создать заказ' },
      { id: 'orders', label: 'Заказы' },
    ];
    if (isAdmin) return [
      { id: 'newOrder', label: 'Создать заказ' },
      { id: 'orders', label: 'Заказы' },
      { id: 'services', label: 'Услуги' },
      { id: 'clients', label: 'Клиенты' },
      { id: 'parts', label: 'Запчасти' },
      { id: 'manage', label: 'Управление' },
    ];
    return [
      { id: 'newOrder', label: 'Создать заказ' },
      { id: 'orders', label: 'Заказы' },
      { id: 'services', label: 'Услуги' },
    ];
  }

  if (!user) {
    return (
      <div className="container">
        <div className="login-brand">
          <img src="/logo.png" alt="logo" className="logo" />
          <h1>ФРЕНЧ ТАУН</h1>
          <p>Peugeot · Citroën · Renault</p>
        </div>
        <div className="tabs">
          <button type="button" className={authMode === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthMode('login')}>Вход</button>
          <button type="button" className={authMode === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthMode('register')}>Регистрация</button>
        </div>
        {error && <p className="error">{error}</p>}
        {authMode === 'login' ? (
          <form className="card" onSubmit={doLogin}>
            <input placeholder="Телефон или логин" value={login} onChange={e => setLogin(e.target.value)} required />
            <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Войти</button>
            <button type="button" className="btn-secondary" onClick={() => setUser({ role: 'guest', name: 'Гость' })}>Как гость</button>
          </form>
        ) : (
          <form className="card card-wide" onSubmit={doRegister}>
            <input placeholder="ФИО" value={reg.name} onChange={e => setReg({ ...reg, name: e.target.value })} required />
            <input placeholder="Телефон" value={reg.phone} onChange={e => setReg({ ...reg, phone: e.target.value })} required />
            <input type="password" placeholder="Пароль" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} required />
            <input placeholder="Марка авто" value={reg.car_brand} onChange={e => setReg({ ...reg, car_brand: e.target.value })} />
            <input placeholder="Модель" value={reg.car_model} onChange={e => setReg({ ...reg, car_model: e.target.value })} />
            <input placeholder="Гос. номер" value={reg.plate_number} onChange={e => setReg({ ...reg, plate_number: e.target.value })} />
            <button type="submit">Зарегистрироваться</button>
          </form>
        )}
      </div>
    );
  }

  const categories = [...new Set(services.map(s => s.category))];
  const name = isGuest ? 'Гость' : isClient ? user.name : user.login;

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img src="/logo.png" alt="logo" className="logo" />
            <div className="brand-text"><h1>ФРЕНЧ ТАУН</h1><span>Сервис французских марок</span></div>
          </div>
          <nav className="navbar">
            {getTabs().map(t => (
              <button key={t.id} type="button" className={tab === t.id ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </nav>
          <div className="user-bar">
            <span>{name}</span>
            <button type="button" className="btn-logout" onClick={() => setUser(null)}>Выйти</button>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <p className="error">{error}</p>}

        {tab === 'services' && (
          <section className="card">
            <h2>Прайс-лист</h2>
            {categories.map(cat => (
              <div key={cat} className="category-block">
                <div className="category-title">{cat}</div>
                <table>
                  <tbody>
                    {services.filter(s => s.category === cat).map(s => (
                      <tr key={s.id}><td>{s.name}</td><td className="price-cell">{s.price} ₽</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>
        )}

        {tab === 'car' && isClient && (
          <section className="card">
            <h2>Мой автомобиль</h2>
            <form className="row" onSubmit={async e => { e.preventDefault(); await fetch(`${API}/clients/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...car, car_year: car.car_year ? Number(car.car_year) : null }) }); loadData(); }}>
              <input placeholder="Марка" value={car.car_brand} onChange={e => setCar({ ...car, car_brand: e.target.value })} />
              <input placeholder="Модель" value={car.car_model} onChange={e => setCar({ ...car, car_model: e.target.value })} />
              <input placeholder="Год" type="number" value={car.car_year} onChange={e => setCar({ ...car, car_year: e.target.value })} />
              <input placeholder="Гос. номер" value={car.plate_number} onChange={e => setCar({ ...car, plate_number: e.target.value })} />
              <input placeholder="VIN" value={car.vin} onChange={e => setCar({ ...car, vin: e.target.value })} />
              <button type="submit">Сохранить</button>
            </form>
          </section>
        )}

        {tab === 'newOrder' && (isClient || isStaff) && (
          <section className="card">
            <h2>Создать заказ</h2>
            <form onSubmit={createOrder}>
              {isStaff && (
                <select value={orderClientId} onChange={e => setOrderClientId(e.target.value)} required>
                  <option value="">Клиент</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.plate_number}</option>)}
                </select>
              )}
              <input className="full-width" placeholder="Название заказа" value={order.title} onChange={e => setOrder({ ...order, title: e.target.value })} required />

              <h3>Добавить услугу</h3>
              <div className="row">
                <select value={order.serviceId} onChange={e => setOrder({ ...order, serviceId: e.target.value })}>
                  <option value="">Выберите услугу</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — {s.price} ₽</option>)}
                </select>
                <button type="button" onClick={addServiceToOrder}>Добавить</button>
              </div>

              <h3>Запчасти</h3>
              {parts.map(p => (
                <label key={p.id} className="part-check">
                  <input type="checkbox" checked={!!order.parts.find(x => x.part_id === p.id)} onChange={() => togglePart(p)} />
                  {p.name} — {p.price} ₽
                </label>
              ))}

              <div className="order-total">
                Работа: {order.workCost} ₽ + Запчасти: {partsSum()} ₽ = <strong>{order.workCost + partsSum()} ₽</strong>
              </div>
              <button type="submit">Оформить</button>
            </form>
          </section>
        )}

        {tab === 'orders' && (isClient || isStaff) && (
          <section className="card">
            <h2>{isClient ? 'Мои заказы' : 'Заказы'}</h2>
            <table>
              <thead>
                <tr>
                  <th>№</th><th>Дата</th>
                  {isStaff && <th>Клиент</th>}
                  <th>Заказ</th><th>Итого</th><th>Статус</th><th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <Fragment key={o.id}>
                    <tr>
                      <td>{o.id}</td>
                      <td>{String(o.date).slice(0, 10)}</td>
                      {isStaff && <td>{o.client_name}</td>}
                      <td>{o.title}</td>
                      <td className="price-cell">{o.total_cost} ₽</td>
                      <td>
                        {isClient ? o.status : (
                          <select value={o.status} onChange={e => fetch(`${API}/orders/${o.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: e.target.value }) }).then(loadData)}>
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        )}
                      </td>
                      <td>
                        {isAdmin && <button type="button" className="btn-danger btn-small" onClick={() => fetch(`${API}/orders/${o.id}`, { method: 'DELETE' }).then(loadData)}>✕</button>}
                        <button type="button" className="btn-small" onClick={() => setOpenOrder(openOrder === o.id ? null : o.id)}>▼</button>
                      </td>
                    </tr>
                    {openOrder === o.id && (
                      <tr><td colSpan={isStaff ? 7 : 6}>
                        <p>Работа: {o.work_cost} ₽ · Запчасти: {o.parts_cost} ₽</p>
                        {o.parts?.map(p => <div key={p.id}>{p.name} x{p.quantity} = {p.price * p.quantity} ₽</div>)}
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'parts' && isAdmin && (
          <section className="card">
            <h2>Запчасти</h2>
            <table><tbody>{parts.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.article}</td><td>{p.price} ₽</td></tr>)}</tbody></table>
            <form className="row" onSubmit={async e => { e.preventDefault(); await fetch(`${API}/parts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newPart, price: Number(newPart.price) }) }); setNewPart({ name: '', article: '', price: '' }); loadData(); }}>
              <input placeholder="Название" value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} required />
              <input placeholder="Артикул" value={newPart.article} onChange={e => setNewPart({ ...newPart, article: e.target.value })} required />
              <input placeholder="Цена" type="number" value={newPart.price} onChange={e => setNewPart({ ...newPart, price: e.target.value })} required />
              <button type="submit">Добавить</button>
            </form>
          </section>
        )}

        {tab === 'clients' && isAdmin && (
          <section className="card">
            <h2>Клиенты</h2>
            <table><tbody>{clients.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.phone}</td><td>{c.car_brand} {c.car_model}</td><td>{c.plate_number}</td></tr>)}</tbody></table>
            <form className="row" onSubmit={async e => { e.preventDefault(); await fetch(`${API}/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newClient, car_year: newClient.car_year ? Number(newClient.car_year) : null }) }); setNewClient({ name: '', phone: '', car_brand: '', car_model: '', car_year: '', plate_number: '', vin: '' }); loadData(); }}>
              <input placeholder="ФИО" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} required />
              <input placeholder="Телефон" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} required />
              <input placeholder="Марка" value={newClient.car_brand} onChange={e => setNewClient({ ...newClient, car_brand: e.target.value })} />
              <input placeholder="Гос. номер" value={newClient.plate_number} onChange={e => setNewClient({ ...newClient, plate_number: e.target.value })} />
              <button type="submit">Добавить</button>
            </form>
          </section>
        )}

        {tab === 'manage' && isAdmin && (
          <section className="card">
            <h2>Новая услуга</h2>
            <form className="row" onSubmit={async e => { e.preventDefault(); await fetch(`${API}/services`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newService, price: Number(newService.price) }) }); setNewService({ category: '', name: '', price: '' }); loadData(); }}>
              <input placeholder="Категория" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} required />
              <input placeholder="Название" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required />
              <input placeholder="Цена" type="number" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required />
              <button type="submit">Добавить</button>
            </form>
          </section>
        )}
      </div>
    </>
  );
}

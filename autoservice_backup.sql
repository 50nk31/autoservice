--
-- PostgreSQL database dump
--

\restrict lXJRy7g0rDfPlUrqd4LGQ6Ju7UKAEEYzB39vZHhp1RCdXO8fSW7ZtFriUCvbujy

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-24 01:19:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16641)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    password character varying(100),
    car_brand character varying(50),
    car_model character varying(50),
    car_year integer,
    plate_number character varying(15),
    vin character varying(17)
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16640)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 219
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- TOC entry 228 (class 1259 OID 16726)
-- Name: order_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_parts (
    id integer NOT NULL,
    order_id integer NOT NULL,
    part_id integer,
    name character varying(100) NOT NULL,
    article character varying(50),
    price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_parts OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16725)
-- Name: order_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_parts_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_parts_id_seq OWNED BY public.order_parts.id;


--
-- TOC entry 226 (class 1259 OID 16698)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    client_id integer NOT NULL,
    status character varying(30) DEFAULT 'новый'::character varying NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    parts_cost numeric(10,2) NOT NULL,
    total_cost numeric(10,2) NOT NULL,
    title character varying(200) NOT NULL,
    work_cost numeric(10,2) DEFAULT 0
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16697)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 222 (class 1259 OID 16653)
-- Name: parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    article character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.parts OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16652)
-- Name: parts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parts_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 221
-- Name: parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parts_id_seq OWNED BY public.parts.id;


--
-- TOC entry 224 (class 1259 OID 16666)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(100),
    price numeric(10,2)
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16665)
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 223
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 230 (class 1259 OID 16749)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'master'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16748)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4780 (class 2604 OID 16644)
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 16729)
-- Name: order_parts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_parts ALTER COLUMN id SET DEFAULT nextval('public.order_parts_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 16701)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4781 (class 2604 OID 16656)
-- Name: parts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts ALTER COLUMN id SET DEFAULT nextval('public.parts_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 16669)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16752)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4960 (class 0 OID 16641)
-- Dependencies: 220
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, phone, password, car_brand, car_model, car_year, plate_number, vin) FROM stdin;
\.


--
-- TOC entry 4968 (class 0 OID 16726)
-- Dependencies: 228
-- Data for Name: order_parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_parts (id, order_id, part_id, name, article, price, quantity) FROM stdin;
\.


--
-- TOC entry 4966 (class 0 OID 16698)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, client_id, status, date, parts_cost, total_cost, title, work_cost) FROM stdin;
\.


--
-- TOC entry 4962 (class 0 OID 16653)
-- Dependencies: 222
-- Data for Name: parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parts (id, name, article, price) FROM stdin;
\.


--
-- TOC entry 4964 (class 0 OID 16666)
-- Dependencies: 224
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, category, price) FROM stdin;
75	Замена задних амортизаторов	Ремонт подвески	800.00
76	Замена сайлентблока переднего рычага	Ремонт подвески	500.00
77	Замена рулевого наконечника	Ремонт подвески	600.00
78	Замена промежуточного подшипника	Ремонт подвески	1500.00
79	Замена рулевой тяги	Ремонт подвески	1000.00
80	Замена задних сайлентблоков балки	Ремонт подвески	4500.00
81	Замена амортизаторов	Ремонт подвески	1500.00
82	Замена опоры (АКПП, МКПП)	Ремонт подвески	3000.00
83	Замена стойки стабилизатора	Ремонт подвески	700.00
84	Замена рычагов	Ремонт подвески	2000.00
85	Замена нижней опоры двигателя	Ремонт подвески	1500.00
86	Замена верхней опоры ДВС	Ремонт подвески	1200.00
87	Диагностика подвески	Ремонт подвески	1000.00
88	Замена втулки стабилизатора	Ремонт подвески	500.00
89	Замена ступичного подшипника	Ремонт подвески	2500.00
90	Замена задней пружины	Ремонт подвески	1000.00
91	Замена привода	Ремонт подвески	2000.00
92	Замена шаровой опоры	Ремонт подвески	1200.00
93	Ремонт подвески	Ремонт подвески	1000.00
94	Шиномонтаж и балансировка R13	Шиномонтаж	1600.00
95	Шиномонтаж и балансировка R14	Шиномонтаж	1700.00
96	Шиномонтаж и балансировка R15	Шиномонтаж	1900.00
97	Шиномонтаж и балансировка R16	Шиномонтаж	2600.00
98	Шиномонтаж и балансировка R17	Шиномонтаж	2500.00
99	Шиномонтаж и балансировка R18	Шиномонтаж	2800.00
100	Шиномонтаж и балансировка R19	Шиномонтаж	3300.00
101	Шиномонтаж и балансировка R20	Шиномонтаж	3600.00
102	Шиномонтаж и балансировка R21	Шиномонтаж	4000.00
103	Шиномонтаж и балансировка R22	Шиномонтаж	4400.00
104	Шиномонтаж и балансировка R23	Шиномонтаж	4600.00
105	Шиномонтаж и балансировка R24	Шиномонтаж	4600.00
106	Замена масла в двигателе	Техническое обслуживание	1500.00
107	Замена тормозной жидкости и охлаждающей	Техническое обслуживание	1500.00
108	Мойка радиаторов	Техническое обслуживание	3500.00
109	Замена масла в редукторе	Техническое обслуживание	800.00
110	Замена масла в раздаточной коробке	Техническое обслуживание	1200.00
111	Частичная замена масла АКПП	Техническое обслуживание	2500.00
112	Замена тормозных дисков и колодок	Техническое обслуживание	1000.00
113	Замена масла в МКПП	Техническое обслуживание	1500.00
114	Компьютерная диагностика	Техническое обслуживание	1200.00
115	Регулировка клапанного механизма	Ремонт автомобиля	3000.00
116	Замена ГРМ	Ремонт автомобиля	5500.00
117	Ремонт стартера	Ремонт автомобиля	1000.00
118	Замена жидкости ГУР	Ремонт автомобиля	1000.00
119	Ремонт генератора	Ремонт автомобиля	3000.00
120	Замена сцепления	Ремонт автомобиля	6000.00
121	Ремонт рулевых реек	Ремонт автомобиля	5000.00
122	Замена АКПП	Ремонт автомобиля	9000.00
123	Замена резонатора	Сварочные работы	1500.00
124	Замена гофры выхлопа	Сварочные работы	2500.00
125	Удаление катализатора	Сварочные работы	3500.00
126	Замена глушителя	Сварочные работы	1000.00
127	Сварка креплений выхлопа	Сварочные работы	1500.00
128	Комплексная диагностика	Диагностика	2500.00
129	Компьютерная диагностика	Диагностика	1200.00
130	Диагностика двигателя	Диагностика	1000.00
131	Диагностика подвески	Диагностика	1000.00
132	Диагностика кондиционера	Кондиционер	2500.00
133	Проверка утечек	Кондиционер	1000.00
134	Заправка кондиционера	Кондиционер	3500.00
135	Отключение Start/Stop	Кодирование опций	2500.00
136	Отключение сигнала ремня	Кодирование опций	2500.00
137	Отключение сигнала ремня (расшир.)	Кодирование опций	5000.00
138	Замена ДВС	Ремонт двигателя	15000.00
139	Капитальный ремонт двигателя	Ремонт двигателя	50000.00
140	Рихтовка	Кузовные работы	5000.00
141	Покраска детали	Покраска	7000.00
142	Ремонт КПП	Ремонт КПП	20000.00
143	Проверка бензиновых форсунок	Форсунки	2500.00
\.


--
-- TOC entry 4970 (class 0 OID 16749)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, password, role) FROM stdin;
1	admin	admin123	admin
2	master	master123	master
\.


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 219
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 2, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_parts_id_seq', 2, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 2, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parts_id_seq', 5, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 223
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 143, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4792 (class 2606 OID 16651)
-- Name: clients clients_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_phone_key UNIQUE (phone);


--
-- TOC entry 4794 (class 2606 OID 16649)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 16737)
-- Name: order_parts order_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_parts
    ADD CONSTRAINT order_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 16714)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16664)
-- Name: parts parts_article_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_article_key UNIQUE (article);


--
-- TOC entry 4798 (class 2606 OID 16662)
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16677)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16761)
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- TOC entry 4808 (class 2606 OID 16759)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16738)
-- Name: order_parts order_parts_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_parts
    ADD CONSTRAINT order_parts_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4811 (class 2606 OID 16743)
-- Name: order_parts order_parts_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_parts
    ADD CONSTRAINT order_parts_part_id_fkey FOREIGN KEY (part_id) REFERENCES public.parts(id);


--
-- TOC entry 4809 (class 2606 OID 16715)
-- Name: orders orders_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


-- Completed on 2026-06-24 01:19:56

--
-- PostgreSQL database dump complete
--

\unrestrict lXJRy7g0rDfPlUrqd4LGQ6Ju7UKAEEYzB39vZHhp1RCdXO8fSW7ZtFriUCvbujy


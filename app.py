"""
Menú setmanal - Sheila & Marc
Aplicació Streamlit per a planificació d'àpats ràpids, càlcul nutricional complet
(Kcal, Proteïnes, Carbohidrats, Greixos), Plats Favorits, Propostes de Menú i Llista de la Compra.
"""

import math
import io
import os
import random
import pandas as pd
import streamlit as st

# -----------------------------------------------------------------------------
# 1. CONFIGURACIÓ DE PÀGINA I ESTILS CSS
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Menú setmanal",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #0d4429;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #4b6354;
        margin-bottom: 1.5rem;
    }
    
    .profile-card {
        background: #f0f7f3;
        border: 1px solid #d1e7dd;
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 1rem;
    }
    .profile-name {
        font-weight: 700;
        color: #0f5132;
        font-size: 1.1rem;
    }
    
    .meal-card {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 18px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        margin-bottom: 1.2rem;
    }
    .theme-badge {
        display: inline-block;
        background-color: #e8f5e9;
        color: #2e7d32;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 9999px;
        margin-bottom: 8px;
    }
    .calc-tag {
        font-size: 0.82rem;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px 12px;
        margin-top: 8px;
    }
    .macro-badge {
        display: inline-block;
        font-weight: 600;
        border-radius: 6px;
        padding: 2px 6px;
        margin-right: 4px;
    }
    
    .stButton>button {
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.2s ease;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. CONSTANTS I SISTEMA D'INTERCANVIS
# -----------------------------------------------------------------------------
PROHIBITED_WORDS = ["bròquil", "brocoli", "brócoli", "coliflor"]

INTERCANVIS = {
    "Sheila": {
        "calories": 1745,
        "Dinar": {"Farinacis": 3.0, "Proteïnes": 4.0, "Verdures": 2.0, "Greixos": 3.0},
        "Sopar": {"Farinacis": 2.0, "Proteïnes": 5.0, "Verdures": 2.0, "Greixos": 3.0},
    },
    "Marc": {
        "calories": 2275,
        "Dinar": {"Farinacis": 4.0, "Proteïnes": 5.0, "Verdures": 2.5, "Greixos": 4.0},
        "Sopar": {"Farinacis": 2.0, "Proteïnes": 4.0, "Verdures": 2.5, "Greixos": 3.0},
    }
}

DIES_SETMANA = [
    "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"
]

GUIA_TEMATICA = {
    "Dilluns": {
        "Dinar": {"desc": "Llegum en amanida", "preferits": {"Farinacis": ["Cigrons de pot Hacendado", "Llenties de pot Hacendado", "Mongetes blanques de pot"]}},
        "Sopar": {"desc": "Sopa freda tipus gaspatxo + Llauna", "preferits": {"Verdures": ["Gaspatxo Hacendado"], "Proteïnes": ["Tonyina clara al natural Hacendado", "Musclos al natural llauna"]}}
    },
    "Dimarts": {
        "Dinar": {"desc": "Cereal cuinat en Batch Cooking (Arròs/Pasta/Cuscús)", "preferits": {"Farinacis": ["Arròs integral Hacendado", "Pasta integral", "Cuscús"]}},
        "Sopar": {"desc": "Peix blanc ràpid", "preferits": {"Proteïnes": ["Lluç congelat", "Bacallà congelat"]}}
    },
    "Dimecres": {
        "Dinar": {"desc": "Llegum o Patata campera", "preferits": {"Farinacis": ["Patata", "Mongetes blanques de pot", "Cigrons de pot Hacendado"]}},
        "Sopar": {"desc": "Dia de l'Ou: Truita/Remenat", "preferits": {"Proteïnes": ["Ous"]}}
    },
    "Dijous": {
        "Dinar": {"desc": "Cereal o Quinoa en fred", "preferits": {"Farinacis": ["Quinoa", "Cuscús", "Arròs integral Hacendado"]}},
        "Sopar": {"desc": "Farcits: Wraps o Fajitas", "preferits": {"Farinacis": ["Fajitas integrals"]}}
    },
    "Divendres": {
        "Dinar": {"desc": "Carn magra planxa + Guarnició", "preferits": {"Proteïnes": ["Pit de pollastre", "Llom de porc", "Vedella magra"]}},
        "Sopar": {"desc": "Sopar ràpid de torrades completes", "preferits": {"Farinacis": ["Pa integral 100%"]}}
    },
    "Dissabte": {
        "Dinar": {"desc": "Plat Únic complet / Arrossos", "preferits": {"Farinacis": ["Arròs integral Hacendado", "Quinoa"]}},
        "Sopar": {"desc": "Pica-pica sa: Hummus, llagostins, musclos...", "preferits": {"Proteïnes": ["Llagostins cuits congelats", "Musclos al natural llauna", "Tonyina clara al natural Hacendado"]}}
    },
    "Diumenge": {
        "Dinar": {"desc": "Arròs / Cuscús", "preferits": {"Farinacis": ["Arròs integral Hacendado", "Cuscús"]}},
        "Sopar": {"desc": "Bikinis integrals + Verdura", "preferits": {"Farinacis": ["Pa integral 100%"], "Proteïnes": ["Gall dindi embotit >85%", "Formatge fresc Burgos Hacendado"]}}
    }
}

# -----------------------------------------------------------------------------
# 3. CÀRREGA DE LA BASE DE DADES (products.csv) AMB NUTRICIÓ
# -----------------------------------------------------------------------------
@st.cache_data
def load_products(csv_path="products.csv"):
    if not os.path.exists(csv_path):
        st.error(f"No s'ha trobat el fitxer {csv_path}.")
        st.stop()
    
    df = pd.read_csv(csv_path)
    
    # Filtre de seguretat estricte
    for forbidden in PROHIBITED_WORDS:
        mask = df['nom'].str.lower().str.contains(forbidden)
        if mask.any():
            df = df[~mask]
            
    return df

df_products = load_products()
PRODUCTS_DICT = df_products.set_index('nom').to_dict(orient='index')

FARINACIS_OPTS = df_products[df_products['grup'] == 'Farinacis']['nom'].tolist()
PROTEINES_OPTS = df_products[df_products['grup'] == 'Proteïnes']['nom'].tolist()
VERDURES_OPTS = df_products[df_products['grup'] == 'Verdures']['nom'].tolist()
GREIXOS_OPTS = df_products[df_products['grup'] == 'Greixos']['nom'].tolist()

# -----------------------------------------------------------------------------
# 4. FUNCIONS NUTRICIONALS
# -----------------------------------------------------------------------------
def calc_item_macros(item_name: str, exchanges: float):
    info = PRODUCTS_DICT.get(item_name, {})
    if not info:
        return {"kcal": 0, "p": 0, "c": 0, "g": 0}
        
    racio_g = info.get("racio_g", 0)
    unitat = info.get("unitat", "g")
    
    grams_total = exchanges * racio_g
    grams_equivalent = (grams_total * 55) if unitat == "unitat" else grams_total
    factor = grams_equivalent / 100.0
    
    kcal = info.get("calories_per_100g", 0) * factor
    prot = info.get("proteines_per_100g", 0) * factor
    carbs = info.get("carbs_per_100g", 0) * factor
    greix = info.get("greixos_per_100g", 0) * factor
    
    return {"kcal": kcal, "p": prot, "c": carbs, "g": greix}

def calc_meal_macros(meal: dict, meal_type: str, user: str):
    total = {"kcal": 0.0, "p": 0.0, "c": 0.0, "g": 0.0}
    
    def add(m):
        total["kcal"] += m["kcal"]
        total["p"] += m["p"]
        total["c"] += m["c"]
        total["g"] += m["g"]
        
    # Farinaci
    if meal.get("farinaci"):
        ex = INTERCANVIS[user][meal_type]["Farinacis"]
        add(calc_item_macros(meal["farinaci"], ex))
        
    # Proteïnes
    prots = meal.get("proteines", [])
    if prots:
        div = len(prots)
        ex = INTERCANVIS[user][meal_type]["Proteïnes"] / div
        for p in prots:
            add(calc_item_macros(p, ex))
            
    # Verdures
    verds = meal.get("verdures", [])
    if verds:
        div = len(verds)
        ex = INTERCANVIS[user][meal_type]["Verdures"] / div
        for v in verds:
            add(calc_item_macros(v, ex))
            
    # Greix
    if meal.get("greix"):
        ex = INTERCANVIS[user][meal_type]["Greixos"]
        add(calc_item_macros(meal["greix"], ex))
        
    return {
        "kcal": round(total["kcal"]),
        "p": round(total["p"], 1),
        "c": round(total["c"], 1),
        "g": round(total["g"], 1),
    }

# -----------------------------------------------------------------------------
# 5. ESTAT DELS FAVORITS I GENERADOR D'ÀPATS
# -----------------------------------------------------------------------------
if "favorits" not in st.session_state:
    st.session_state.favorits = [
        {
            "nom": "Amanida fresca de cigrons i tonyina",
            "farinaci": "Cigrons de pot Hacendado",
            "proteines": ["Tonyina clara al natural Hacendado", "Ous"],
            "verdures": ["Tomàquet xerri", "Bossa Canonges"],
            "greix": "Alvocat"
        },
        {
            "nom": "Fajita integral de pollastre amb guacamole",
            "farinaci": "Fajitas integrals",
            "proteines": ["Tires de pollastre al forn Hacendado"],
            "verdures": ["Bossa Ruca", "Pebrot vermell/verd"],
            "greix": "Guacamole Hacendado 95%"
        }
    ]

if "prefer_favorits" not in st.session_state:
    st.session_state.prefer_favorits = True

def get_random_choice(options, preferred_list=None):
    if preferred_list:
        candidates = [p for p in preferred_list if p in options]
        if candidates and random.random() < 0.8:
            return random.choice(candidates)
    return random.choice(options) if options else None

def generate_meal(day: str, meal_type: str, locked_data=None):
    if locked_data and locked_data.get("locked", False):
        return locked_data

    # Preferència per favorits si està actiu
    if st.session_state.prefer_favorits and st.session_state.favorits and random.random() < 0.35:
        fav = random.choice(st.session_state.favorits)
        return {
            "farinaci": fav["farinaci"],
            "proteines": list(fav["proteines"]),
            "verdures": list(fav["verdures"]),
            "greix": fav["greix"],
            "locked": False,
            "is_fav": True
        }

    theme_pref = GUIA_TEMATICA.get(day, {}).get(meal_type, {}).get("preferits", {})
    
    # 1 Farinaci
    farinaci = get_random_choice(FARINACIS_OPTS, theme_pref.get("Farinacis"))
    
    # 1 o 2 Proteïnes
    pref_prot = theme_pref.get("Proteïnes")
    num_prot = 2 if random.random() < 0.6 else 1
    if pref_prot and any(p in PROTEINES_OPTS for p in pref_prot):
        p1 = get_random_choice(PROTEINES_OPTS, pref_prot)
        if num_prot == 2:
            remaining_p = [p for p in PROTEINES_OPTS if p != p1]
            p2 = get_random_choice(remaining_p)
            proteines = [p1, p2]
        else:
            proteines = [p1]
    else:
        proteines = random.sample(PROTEINES_OPTS, k=min(num_prot, len(PROTEINES_OPTS)))
        
    # 1 o 2 Verdures
    pref_verd = theme_pref.get("Verdures")
    num_verd = 2 if random.random() < 0.7 else 1
    if pref_verd and any(v in VERDURES_OPTS for v in pref_verd):
        v1 = get_random_choice(VERDURES_OPTS, pref_verd)
        if num_verd == 2:
            remaining_v = [v for v in VERDURES_OPTS if v != v1]
            v2 = get_random_choice(remaining_v)
            verdures = [v1, v2]
        else:
            verdures = [v1]
    else:
        verdures = random.sample(VERDURES_OPTS, k=min(num_verd, len(VERDURES_OPTS)))
        
    # 1 Greix
    greix = get_random_choice(GREIXOS_OPTS, theme_pref.get("Greixos"))
    
    return {
        "farinaci": farinaci,
        "proteines": proteines,
        "verdures": verdures,
        "greix": greix,
        "locked": False,
        "is_fav": False
    }

def init_weekly_menu(force=False):
    if "menu" not in st.session_state or force:
        new_menu = {}
        for day in DIES_SETMANA:
            new_menu[day] = {
                "Dinar": generate_meal(day, "Dinar"),
                "Sopar": generate_meal(day, "Sopar")
            }
        st.session_state.menu = new_menu

init_weekly_menu(force=False)

if "rebost" not in st.session_state:
    st.session_state.rebost = set()

# -----------------------------------------------------------------------------
# 6. SIDEBAR: REBOST
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🥫 El Teu Rebost")
    st.info("Marca els ingredients que ja tens a casa perquè es **descomptin** de la llista de la compra.")
    
    col_r1, col_r2 = st.columns(2)
    if col_r1.button("Desmarcar tot", use_container_width=True):
        st.session_state.rebost = set()
        st.rerun()
    if col_r2.button("Marcar bàsics", use_container_width=True):
        st.session_state.rebost.update([
            "Oli d'oliva verge extra", "Arròs integral Hacendado", "Pasta integral", "Ceba", "Pastanaga"
        ])
        st.rerun()
        
    search_term = st.text_input("🔍 Cerca producte al rebost", "").lower().strip()
    
    for grup in ["Farinacis", "Proteïnes", "Verdures", "Greixos"]:
        with st.expander(f"📦 {grup}", expanded=(grup == "Farinacis")):
            sub_prods = df_products[df_products['grup'] == grup]['nom'].tolist()
            if search_term:
                sub_prods = [p for p in sub_prods if search_term in p.lower()]
                
            for p in sub_prods:
                is_checked = p in st.session_state.rebost
                val = st.checkbox(p, value=is_checked, key=f"rebost_{p}")
                if val and not is_checked:
                    st.session_state.rebost.add(p)
                elif not val and is_checked:
                    st.session_state.rebost.remove(p)

# -----------------------------------------------------------------------------
# 7. CAPÇALERA I TARGETES INFORMATIVES
# -----------------------------------------------------------------------------
st.markdown('<div class="main-title">🥗 Menú setmanal</div>', unsafe_allow_html=True)

col_sheila, col_marc = st.columns(2)
with col_sheila:
    st.markdown("""
    <div class="profile-card">
        <div class="profile-name">👩 Sheila (1.745 kcal)</div>
        <small><b>Dinar:</b> 3 Farinacis | 4 Proteïnes | 2 Verdures | 3 Greixos</small><br/>
        <small><b>Sopar:</b> 2 Farinacis | 5 Proteïnes | 2 Verdures | 3 Greixos</small>
    </div>
    """, unsafe_allow_html=True)

with col_marc:
    st.markdown("""
    <div class="profile-card">
        <div class="profile-name">👨 Marc (2.275 kcal)</div>
        <small><b>Dinar:</b> 4 Farinacis | 5 Proteïnes | 2.5 Verdures | 4 Greixos</small><br/>
        <small><b>Sopar:</b> 2 Farinacis | 4 Proteïnes | 2.5 Verdures | 3 Greixos</small>
    </div>
    """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 8. SECCIÓ: MENÚ D'UN SOL COP D'ULL (SENSE SCROLL)
# -----------------------------------------------------------------------------
with st.expander("🖼️ Menú setmanal d'un sol cop d'ull (Sense fer scroll)", expanded=True):
    st.caption("Visualitza els àpats dels 7 dies de la setmana en una sola imatge/taula compacta:")
    
    # Construcció de la taula horitzontal amb els 7 dies en columnes
    overview_cols = st.columns(7)
    for idx_d, dia in enumerate(DIES_SETMANA):
        with overview_cols[idx_d]:
            d_meal = st.session_state.menu[dia]["Dinar"]
            s_meal = st.session_state.menu[dia]["Sopar"]
            is_wk = dia in ["Dissabte", "Diumenge"]
            bg_col = "#f1f5f9" if is_wk else "#f8fafc"
            hdr_col = "#334155" if is_wk else "#047857"
            
            st.markdown(f"""
            <div style="background:{bg_col}; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; font-size:11px; margin-bottom:8px;">
                <div style="background:{hdr_col}; color:white; font-weight:700; text-align:center; padding:4px 2px;">
                    {dia}
                </div>
                <div style="padding:6px; background:#fffbeb; border-bottom:1px solid #fef3c7;">
                    <b style="color:#b45309;">☀️ Dinar</b><br/>
                    <b>🍞 {d_meal['farinaci']}</b><br/>
                    <span style="color:#334155;">🍗 {', '.join(d_meal['proteines'])}</span><br/>
                    <span style="color:#15803d;">🥬 {', '.join(d_meal['verdures'])}</span><br/>
                    <span style="color:#64748b;">🥑 {d_meal['greix']}</span>
                </div>
                <div style="padding:6px; background:#f0fdf4;">
                    <b style="color:#166534;">🌙 Sopar</b><br/>
                    <b>🍞 {s_meal['farinaci']}</b><br/>
                    <span style="color:#334155;">🍗 {', '.join(s_meal['proteines'])}</span><br/>
                    <span style="color:#15803d;">🥬 {', '.join(s_meal['verdures'])}</span><br/>
                    <span style="color:#64748b;">🥑 {s_meal['greix']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 8. RESUM NUTRICIONAL SETMANAL GLOBAL
# -----------------------------------------------------------------------------
def get_weekly_totals():
    tot_sheila = {"kcal": 0, "p": 0.0, "c": 0.0, "g": 0.0}
    tot_marc = {"kcal": 0, "p": 0.0, "c": 0.0, "g": 0.0}
    
    for day in DIES_SETMANA:
        for meal_type in ["Dinar", "Sopar"]:
            meal = st.session_state.menu[day][meal_type]
            sh = calc_meal_macros(meal, meal_type, "Sheila")
            mc = calc_meal_macros(meal, meal_type, "Marc")
            
            tot_sheila["kcal"] += sh["kcal"]
            tot_sheila["p"] += sh["p"]
            tot_sheila["c"] += sh["c"]
            tot_sheila["g"] += sh["g"]
            
            tot_marc["kcal"] += mc["kcal"]
            tot_marc["p"] += mc["p"]
            tot_marc["c"] += mc["c"]
            tot_marc["g"] += mc["g"]
            
    return tot_sheila, tot_marc

sh_tot, mc_tot = get_weekly_totals()

with st.expander("📊 Resum Nutricional i Balanç Setmanal", expanded=True):
    col_n1, col_n2 = st.columns(2)
    with col_n1:
        st.markdown(f"**👩 Sheila (Mitjana diària Dinar + Sopar):** `{round(sh_tot['kcal']/7)} kcal/dia`")
        st.markdown(f"Proteïnes: **{round(sh_tot['p']/7, 1)}g** | Carbs: **{round(sh_tot['c']/7, 1)}g** | Greixos: **{round(sh_tot['g']/7, 1)}g**")
        st.caption(f"Aportació: {round((sh_tot['kcal']/7 / 1745) * 100)}% de les 1.745 kcal diàries (restant per esmorzar/berenar).")
    with col_n2:
        st.markdown(f"**👨 Marc (Mitjana diària Dinar + Sopar):** `{round(mc_tot['kcal']/7)} kcal/dia`")
        st.markdown(f"Proteïnes: **{round(mc_tot['p']/7, 1)}g** | Carbs: **{round(mc_tot['c']/7, 1)}g** | Greixos: **{round(mc_tot['g']/7, 1)}g**")
        st.caption(f"Aportació: {round((mc_tot['kcal']/7 / 2275) * 100)}% de les 2.275 kcal diàries.")

# -----------------------------------------------------------------------------
# 9. BOTONS D'ACCIÓ I PREFERÈNCIA DE FAVORITS
# -----------------------------------------------------------------------------
bcol1, bcol2, bcol3 = st.columns([2, 2, 3])
with bcol1:
    if st.button("🎲 Generar Menú Nou", use_container_width=True, type="primary"):
        for day in DIES_SETMANA:
            for meal_type in ["Dinar", "Sopar"]:
                current = st.session_state.menu[day][meal_type]
                if not current.get("locked", False):
                    st.session_state.menu[day][meal_type] = generate_meal(day, meal_type)
        st.success("Menú generat amb èxit!")
        st.rerun()

with bcol2:
    st.session_state.prefer_favorits = st.checkbox(
        "⭐ Prioritzar Plats Favorits", 
        value=st.session_state.prefer_favorits,
        help="Quan està marcat, el generador té més probabilitat d'escollir els teus plats favorits."
    )

# -----------------------------------------------------------------------------
# 10. SECCIÓ DE PROPOSTES DE MENÚ AUTOMÀTIQUES AMB CANVI DE PLAT
# -----------------------------------------------------------------------------
with st.expander("💡 Propostes Automàtiques de Menú Setmanal (Amb opció de canviar el plat)", expanded=False):
    st.markdown("Pots revisar una proposta ràpida i **canviar qualsevol plat amb un clic** si no t'agrada abans d'aplicar-la:")
    
    prop_type = st.radio(
        "Escull temàtica de proposta:",
        ["🍱 Batch Cooking i Preparació Diumenge", "⚡ Super Ràpida & En Fred (10 min)", "💪 Alta en Proteïna & Esportiva"],
        horizontal=True
    )
    
    col_p_day, col_p_action = st.columns([3, 1])
    p_day = col_p_day.selectbox("Revisar dia de la proposta:", DIES_SETMANA)
    
    # Menú d'exemple per a la proposta seleccionada
    p_dinar = st.session_state.menu[p_day]["Dinar"]
    p_sopar = st.session_state.menu[p_day]["Sopar"]
    
    col_pd1, col_pd2 = st.columns(2)
    with col_pd1:
        st.markdown(f"**☀️ Dinar {p_day}:** {p_dinar['farinaci']} + {', '.join(p_dinar['proteines'])} + {', '.join(p_dinar['verdures'])} + {p_dinar['greix']}")
        if st.button(f"🔄 Canviar Dinar de {p_day} (no m'agrada)", key=f"prop_swap_dinar_{p_day}"):
            st.session_state.menu[p_day]["Dinar"] = generate_meal(p_day, "Dinar")
            st.rerun()
            
    with col_pd2:
        st.markdown(f"**🌙 Sopar {p_day}:** {p_sopar['farinaci']} + {', '.join(p_sopar['proteines'])} + {', '.join(p_sopar['verdures'])} + {p_sopar['greix']}")
        if st.button(f"🔄 Canviar Sopar de {p_day} (no m'agrada)", key=f"prop_swap_sopar_{p_day}"):
            st.session_state.menu[p_day]["Sopar"] = generate_meal(p_day, "Sopar")
            st.rerun()

# -----------------------------------------------------------------------------
# 11. GESTIÓ DE PLATS FAVORITS
# -----------------------------------------------------------------------------
with st.expander(f"⭐ Els Teus Plats Favorits ({len(st.session_state.favorits)})", expanded=False):
    col_f1, col_f2 = st.columns([3, 1])
    with col_f1:
        for idx, fav in enumerate(st.session_state.favorits):
            st.markdown(f"**⭐ {fav['nom']}**")
            st.caption(f"🍞 {fav['farinaci']} | 🍗 {', '.join(fav['proteines'])} | 🥬 {', '.join(fav['verdures'])} | 🥑 {fav['greix']}")
    with col_f2:
        if st.session_state.favorits and st.button("🗑️ Netejar favorits"):
            st.session_state.favorits = []
            st.rerun()

# -----------------------------------------------------------------------------
# 12. GRAELLA SETMANAL D'ÀPATS
# -----------------------------------------------------------------------------
st.markdown("---")
st.subheader("📅 Planificador d'Àpats de la Setmana")

tabs = st.tabs([f"🗓️ {dia}" for dia in DIES_SETMANA])

for idx_dia, dia in enumerate(DIES_SETMANA):
    with tabs[idx_dia]:
        col_dinar, col_sopar = st.columns(2)
        
        for idx_meal, meal_type in enumerate(["Dinar", "Sopar"]):
            target_col = col_dinar if meal_type == "Dinar" else col_sopar
            meal_data = st.session_state.menu[dia][meal_type]
            guia = GUIA_TEMATICA[dia][meal_type]
            
            with target_col:
                st.markdown(f"""
                <div class="meal-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="margin:0; color:#1e293b;">🍽️ {meal_type}</h4>
                        <span class="theme-badge">💡 {guia['desc']}</span>
                    </div>
                """, unsafe_allow_html=True)
                
                # Bloqueig, regeneració i favorit
                c_act1, c_act2, c_act3 = st.columns([1, 1, 1])
                with c_act1:
                    is_locked = st.checkbox("🔒 Bloquejat", value=meal_data.get("locked", False), key=f"lock_{dia}_{meal_type}")
                    meal_data["locked"] = is_locked
                with c_act2:
                    if st.button("🔄 Canviar", key=f"btn_reg_{dia}_{meal_type}"):
                        st.session_state.menu[dia][meal_type] = generate_meal(dia, meal_type)
                        st.rerun()
                with c_act3:
                    if st.button("⭐ Favorit", key=f"btn_fav_{dia}_{meal_type}"):
                        st.session_state.favorits.append({
                            "nom": f"{meal_type} {dia}: {meal_data['farinaci']} + {meal_data['proteines'][0]}",
                            "farinaci": meal_data["farinaci"],
                            "proteines": list(meal_data["proteines"]),
                            "verdures": list(meal_data["verdures"]),
                            "greix": meal_data["greix"]
                        })
                        st.success("Guardat a favorits!")
                        st.rerun()

                # Selectors
                far_idx = FARINACIS_OPTS.index(meal_data["farinaci"]) if meal_data["farinaci"] in FARINACIS_OPTS else 0
                sel_farinaci = st.selectbox("🍞 Farinaci (1)", options=FARINACIS_OPTS, index=far_idx, key=f"far_{dia}_{meal_type}")
                meal_data["farinaci"] = sel_farinaci
                
                def_prots = [p for p in meal_data["proteines"] if p in PROTEINES_OPTS][:2]
                sel_prots = st.multiselect("🍗 Proteïna (màx. 2)", options=PROTEINES_OPTS, default=def_prots, max_selections=2, key=f"prot_{dia}_{meal_type}")
                if not sel_prots: sel_prots = [PROTEINES_OPTS[0]]
                meal_data["proteines"] = sel_prots
                
                def_verds = [v for v in meal_data["verdures"] if v in VERDURES_OPTS][:2]
                sel_verds = st.multiselect("🥬 Verdura (màx. 2)", options=VERDURES_OPTS, default=def_verds, max_selections=2, key=f"verd_{dia}_{meal_type}")
                if not sel_verds: sel_verds = [VERDURES_OPTS[0]]
                meal_data["verdures"] = sel_verds
                
                greix_idx = GREIXOS_OPTS.index(meal_data["greix"]) if meal_data["greix"] in GREIXOS_OPTS else 0
                sel_greix = st.selectbox("🥑 Greix (1)", options=GREIXOS_OPTS, index=greix_idx, key=f"gr_{dia}_{meal_type}")
                meal_data["greix"] = sel_greix
                
                # Càlculs nutricionals de l'àpat
                nut_sh = calc_meal_macros(meal_data, meal_type, "Sheila")
                nut_mc = calc_meal_macros(meal_data, meal_type, "Marc")
                
                st.markdown(f"""
                <div class="calc-tag">
                    <b>👩 Sheila:</b> {nut_sh['kcal']} kcal (P: {nut_sh['p']}g | C: {nut_sh['c']}g | G: {nut_sh['g']}g)<br/>
                    <b>👨 Marc:</b> {nut_mc['kcal']} kcal (P: {nut_mc['p']}g | C: {nut_mc['c']}g | G: {nut_mc['g']}g)
                </div>
                </div>
                """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 13. MOTOR DE COMPRA I EXCEL (.XLSX)
# -----------------------------------------------------------------------------
def calculate_shopping_list():
    aggregated = {}
    for dia, meals in st.session_state.menu.items():
        for meal_type, meal in meals.items():
            if meal.get("farinaci"):
                r = PRODUCTS_DICT[meal["farinaci"]]["racio_g"]
                req = (INTERCANVIS["Sheila"][meal_type]["Farinacis"] + INTERCANVIS["Marc"][meal_type]["Farinacis"]) * r
                aggregated[meal["farinaci"]] = aggregated.get(meal["farinaci"], 0) + req
                
            for p in meal.get("proteines", []):
                r = PRODUCTS_DICT[p]["racio_g"]
                div = len(meal["proteines"])
                req = ((INTERCANVIS["Sheila"][meal_type]["Proteïnes"] + INTERCANVIS["Marc"][meal_type]["Proteïnes"]) / div) * r
                aggregated[p] = aggregated.get(p, 0) + req
                
            for v in meal.get("verdures", []):
                r = PRODUCTS_DICT[v]["racio_g"]
                div = len(meal["verdures"])
                req = ((INTERCANVIS["Sheila"][meal_type]["Verdures"] + INTERCANVIS["Marc"][meal_type]["Verdures"]) / div) * r
                aggregated[v] = aggregated.get(v, 0) + req
                
            if meal.get("greix"):
                r = PRODUCTS_DICT[meal["greix"]]["racio_g"]
                req = (INTERCANVIS["Sheila"][meal_type]["Greixos"] + INTERCANVIS["Marc"][meal_type]["Greixos"]) * r
                aggregated[meal["greix"]] = aggregated.get(meal["greix"], 0) + req
                
    rows = []
    for item_name, total_needed in aggregated.items():
        info = PRODUCTS_DICT.get(item_name, {})
        fmt_c = info.get("format_compra", 1)
        fmt_u = info.get("format_unitat", "g")
        preu_fmt = float(info.get("preu_format", 1.50))
        in_p = item_name in st.session_state.rebost
        paquets = 0 if in_p else math.ceil(total_needed / fmt_c)
        cost_total = round(paquets * preu_fmt, 2)
        
        rows.append({
            "Producte": item_name,
            "Grup": info.get("grup", ""),
            "Secció Supermercat": info.get("seccio", "Altres"),
            "Quantitat Neta Requerida": f"{round(total_needed, 1)} {fmt_u}",
            "Format Venda Mercadona": f"{fmt_c} {fmt_u}",
            "Preu Format": f"{preu_fmt:.2f} €",
            "Paquets a Comprar": paquets,
            "Cost Total (€)": cost_total,
            "Cost Total": f"{cost_total:.2f} €",
            "Al Rebost": in_p,
            "Estat": "🥫 Al Rebost" if in_p else "🛒 A comprar"
        })
    return pd.DataFrame(rows)

df_shopping = calculate_shopping_list()

def generate_excel():
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        menu_rows = []
        for dia, meals in st.session_state.menu.items():
            for m_type, m in meals.items():
                sh = calc_meal_macros(m, m_type, "Sheila")
                mc = calc_meal_macros(m, m_type, "Marc")
                menu_rows.append({
                    "Dia": dia,
                    "Àpat": m_type,
                    "Farinaci": m["farinaci"],
                    "Proteïnes": ", ".join(m["proteines"]),
                    "Verdures": ", ".join(m["verdures"]),
                    "Greix": m["greix"],
                    "Kcal Sheila": sh["kcal"],
                    "Kcal Marc": mc["kcal"]
                })
        pd.DataFrame(menu_rows).to_excel(writer, sheet_name="Menú Setmanal", index=False)
        df_shopping.to_excel(writer, sheet_name="Compra", index=False)
    return output.getvalue()

excel_file = generate_excel()

with bcol3:
    st.download_button(
        "📥 Descarregar Excel (.xlsx)",
        data=excel_file,
        file_name="Menu_Setmanal_Nutricio_Compra.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        use_container_width=True
    )

# -----------------------------------------------------------------------------
# 14. SECCIÓ COMPRA
# -----------------------------------------------------------------------------
st.markdown("---")
st.subheader("🛒 Compra Mercadona (Agrupada per Seccions)")

seccions = sorted(df_shopping['Secció Supermercat'].unique())
for seccio in seccions:
    sub_df = df_shopping[df_shopping['Secció Supermercat'] == seccio]
    with st.expander(f"📦 {seccio} ({len(sub_df[~sub_df['Al Rebost']])} a comprar)", expanded=True):
        st.dataframe(
            sub_df[["Producte", "Quantitat Neta Requerida", "Format Venda Mercadona", "Preu Format", "Paquets a Comprar", "Cost Total", "Estat"]],
            hide_index=True,
            use_container_width=True
        )

# TOTAL DE DINERS DE LA COMPRA AL FINAL DE LA SECCIÓ
total_cost_compra = df_shopping[~df_shopping['Al Rebost']]['Cost Total (€)'].sum()
total_paquets_compra = df_shopping[~df_shopping['Al Rebost']]['Paquets a Comprar'].sum()
estalvi_rebost = df_shopping[df_shopping['Al Rebost']]['Cost Total (€)'].sum()

st.markdown(f"""
<div style="background: linear-gradient(135deg, #064e3b, #0f172a); color: white; padding: 24px; border-radius: 16px; margin-top: 24px; border: 1px solid #059669;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
            <span style="background: #047857; color: #a7f3d0; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold;">
                💶 Resum Econòmic Final
            </span>
            <h2 style="color: white; margin: 8px 0 4px 0; font-size: 24px; font-weight: 800;">
                Total de diners de la compra
            </h2>
            <p style="color: #a7f3d0; margin: 0; font-size: 14px;">
                Càlcul matemàtic dels {total_paquets_compra} paquets a comprar a Mercadona
            </p>
        </div>
        <div style="background: rgba(6, 78, 59, 0.8); border: 1px solid #10b981; border-radius: 12px; padding: 16px 28px; text-align: right;">
            <div style="color: #6ee7b7; font-size: 12px; font-weight: bold; text-transform: uppercase;">Import Total Estimat</div>
            <div style="color: #a7f3d0; font-size: 38px; font-weight: 900; font-family: monospace;">{total_cost_compra:.2f} €</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

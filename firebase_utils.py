import firebase_admin
from firebase_admin import auth, credentials

# Inicializa Firebase apenas uma vez no projeto
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("firebase_service_account.json")  # ajuste se seu JSON estiver em outro nome
    firebase_admin.initialize_app(cred)

def gerar_link_reset(email_usuario):
    try:
        link = auth.generate_password_reset_link(email_usuario)
        print("✅ Link de reset gerado:", link)
        return link
    except Exception as e:
        print("❌ Erro ao gerar link de reset:", e)
        return None


import firebase_admin
from firebase_admin import auth

# Inicialize o Firebase Admin se ainda não fez (fora desta função)
# firebase_admin.initialize_app()

def gerar_link_reset_e_enviar(destinatario):
    try:
        # GERA LINK DE RESET NO FIREBASE
        link_reset = auth.generate_password_reset_link(destinatario)
        print("🔗 Link de reset gerado:", link_reset)

        # ENVIA EMAIL BONITO
        enviado = enviar_email_reset(destinatario, link_reset)
        return enviado

    except Exception as e:
        print(f"❌ Erro ao gerar link ou enviar email: {e}")
        return False

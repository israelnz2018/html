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

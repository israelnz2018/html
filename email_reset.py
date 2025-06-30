import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_email_reset(destinatario_email, link_reset):
    remetente = "contact@learningbyworking.com"
    senha_remetente = "Dani4035*+"
    servidor_smtp = "smtp.hostinger.com"
    porta_smtp = 465

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Recuperação de Senha – Learning by Working"
    msg["From"] = remetente
    msg["To"] = destinatario_email

    html = f"""
    <html>
      <body>
        <p>Olá,</p>
        <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo:</p>
        <p><a href="{link_reset}" style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">Redefinir Senha</a></p>
        <p>Se não solicitou, ignore este e-mail.</p>
        <br>
        <p>Equipe Learning by Working</p>
      </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL(servidor_smtp, porta_smtp) as server:
            server.login(remetente, senha_remetente)
            server.sendmail(remetente, destinatario_email, msg.as_string())
            print("✅ E-mail enviado com sucesso.")
    except Exception as e:
        print("❌ Erro ao enviar e-mail:", e)

import os
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
FROM_EMAIL = "Anonimax <noreply@anonimax.com>"

async def send_email(to: str, subject: str, html: str) -> bool:
    """Envoyer un email via Resend API"""
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY not configured")
        return False
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": FROM_EMAIL,
                    "to": [to],
                    "subject": subject,
                    "html": html
                }
            )
            
            if response.status_code == 200:
                logger.info(f"Email sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send email: {response.text}")
                return False
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False


async def send_verification_email(to: str, verification_link: str) -> bool:
    """Envoyer email de vérification"""
    subject = "Verifique seu email - Anonimax"
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #22d3ee; margin: 0; }}
            .content {{ text-align: center; }}
            .button {{ display: inline-block; background: linear-gradient(to right, #22d3ee, #a855f7); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🛡️ Anonimax</h1>
            </div>
            <div class="content">
                <h2>Verifique seu email</h2>
                <p>Clique no botão abaixo para verificar seu email e ativar sua conta Anonimax.</p>
                <a href="{verification_link}" class="button">Verificar Email</a>
                <p style="color: #64748b; font-size: 14px;">Se você não criou uma conta no Anonimax, ignore este email.</p>
            </div>
            <div class="footer">
                <p>© 2024 Anonimax - Sua identidade, seu controle</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to, subject, html)


async def send_welcome_email(to: str, anonimax_id: str, temp_password: str) -> bool:
    """Envoyer email de bienvenue avec Anonimax ID et mot de passe provisoire"""
    subject = "Bem-vindo ao Anonimax - Seus dados de acesso"
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #22d3ee; margin: 0; }}
            .content {{ text-align: center; }}
            .credentials {{ background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .credential-item {{ margin: 15px 0; }}
            .credential-label {{ color: #64748b; font-size: 12px; text-transform: uppercase; }}
            .credential-value {{ color: #22d3ee; font-size: 24px; font-weight: bold; font-family: monospace; }}
            .warning {{ background-color: #7c2d12; border-radius: 8px; padding: 15px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🛡️ Anonimax</h1>
            </div>
            <div class="content">
                <h2>Bem-vindo ao Anonimax!</h2>
                <p>Seu email foi verificado com sucesso. Aqui estão seus dados de acesso:</p>
                
                <div class="credentials">
                    <div class="credential-item">
                        <div class="credential-label">Seu Anonimax ID</div>
                        <div class="credential-value">{anonimax_id}</div>
                    </div>
                    <div class="credential-item">
                        <div class="credential-label">Senha Provisória</div>
                        <div class="credential-value">{temp_password}</div>
                    </div>
                </div>
                
                <div class="warning">
                    <p style="margin: 0; color: #fbbf24;">⚠️ <strong>Importante:</strong> Recomendamos que você altere sua senha provisória após o primeiro login.</p>
                </div>
                
                <p>Use seu Anonimax ID e senha para fazer login na plataforma.</p>
            </div>
            <div class="footer">
                <p>© 2024 Anonimax - Sua identidade, seu controle</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to, subject, html)


async def send_password_recovery_email(to: str, anonimax_id: str, temp_password: str) -> bool:
    """Envoyer email de récupération de mot de passe"""
    subject = "Recuperação de senha - Anonimax"
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #22d3ee; margin: 0; }}
            .content {{ text-align: center; }}
            .credentials {{ background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .credential-item {{ margin: 15px 0; }}
            .credential-label {{ color: #64748b; font-size: 12px; text-transform: uppercase; }}
            .credential-value {{ color: #22d3ee; font-size: 24px; font-weight: bold; font-family: monospace; }}
            .warning {{ background-color: #7c2d12; border-radius: 8px; padding: 15px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🛡️ Anonimax</h1>
            </div>
            <div class="content">
                <h2>Recuperação de Senha</h2>
                <p>Você solicitou a recuperação de sua senha. Aqui estão seus novos dados de acesso:</p>
                
                <div class="credentials">
                    <div class="credential-item">
                        <div class="credential-label">Seu Anonimax ID</div>
                        <div class="credential-value">{anonimax_id}</div>
                    </div>
                    <div class="credential-item">
                        <div class="credential-label">Nova Senha Provisória</div>
                        <div class="credential-value">{temp_password}</div>
                    </div>
                </div>
                
                <div class="warning">
                    <p style="margin: 0; color: #fbbf24;">⚠️ <strong>Importante:</strong> Altere sua senha provisória após o login.</p>
                </div>
                
                <p>Se você não solicitou esta recuperação, entre em contato conosco imediatamente.</p>
            </div>
            <div class="footer">
                <p>© 2024 Anonimax - Sua identidade, seu controle</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to, subject, html)


async def send_admin_credentials_email(to: str, temp_password: str) -> bool:
    """Envoyer email avec credentials admin"""
    subject = "Credenciais de Administrador - Anonimax"
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #22d3ee; margin: 0; }}
            .content {{ text-align: center; }}
            .credentials {{ background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .credential-item {{ margin: 15px 0; }}
            .credential-label {{ color: #64748b; font-size: 12px; text-transform: uppercase; }}
            .credential-value {{ color: #a855f7; font-size: 24px; font-weight: bold; font-family: monospace; }}
            .admin-badge {{ background: linear-gradient(to right, #a855f7, #22d3ee); color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }}
            .warning {{ background-color: #7c2d12; border-radius: 8px; padding: 15px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🛡️ Anonimax</h1>
            </div>
            <div class="content">
                <span class="admin-badge">👑 ADMINISTRADOR</span>
                <h2>Credenciais de Administrador</h2>
                <p>Sua conta de administrador foi criada com sucesso.</p>
                
                <div class="credentials">
                    <div class="credential-item">
                        <div class="credential-label">Email</div>
                        <div class="credential-value" style="font-size: 18px;">{to}</div>
                    </div>
                    <div class="credential-item">
                        <div class="credential-label">Senha Provisória</div>
                        <div class="credential-value">{temp_password}</div>
                    </div>
                </div>
                
                <div class="warning">
                    <p style="margin: 0; color: #fbbf24;">⚠️ <strong>Importante:</strong> Altere sua senha provisória imediatamente após o primeiro login.</p>
                </div>
                
                <p>Acesse o painel de administração em /admin para gerenciar usuários, anúncios e pagamentos.</p>
            </div>
            <div class="footer">
                <p>© 2024 Anonimax - Sua identidade, seu controle</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to, subject, html)
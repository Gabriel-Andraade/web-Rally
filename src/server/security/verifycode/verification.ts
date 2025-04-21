import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rallychampioship@gmail.com",
      pass: "eixz elqz orur qpxi",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Código de Verificação",
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificação</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4a6bff;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .verification-code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #4a6bff;
          margin: 25px 0;
          padding: 15px;
          background-color: #f0f4ff;
          border-radius: 5px;
          display: inline-block;
        }
        .instructions {
          margin: 20px 0;
          line-height: 1.6;
          color: #555;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          background-color: #f9f9f9;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #4a6bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://via.placeholder.com/150x50?text=Seu+Logo" alt="Logo" class="logo">
          <h1>Código de Verificação</h1>
        </div>
        <div class="content">
          <p>Olá,</p>
          <p>Recebemos uma solicitação para verificar seu e-mail. Use o seguinte código para confirmar sua identidade:</p>
          
          <div class="verification-code">${verificationCode}</div>
          
          <p class="instructions">
            Este código é válido por 15 minutos. Se você não solicitou este código, por favor ignore este e-mail.
          </p>
          
          <p>Atenciosamente,<br>Equipe de Suporte</p>
        </div>
        <div class="footer">
          <p>© 2025 Gabriel. Todos os direitos reservados.</p>
          <p>Se precisar de ajuda, entre em contato conosco pelo e-mail suporte@fromrally.com</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Código de verificação enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw new Error("Não foi possível enviar o código de verificação.");
  }
}

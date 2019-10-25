import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// Buscando o token
export default async (req, res, next) => {
  const authHeader = req.headers.autorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided ' });
  }

  // divindo o token, que ficara dentro de um array -
  // Exemplo: [alguma coisa, token], com o split(' '),
  // consiguimos eliminar o espaço e pegar a informação
  // dentro do array que neste momento é o token
  const [, token] = authHeader.split(' ');

  // Caso retorne erro, o token é invalido
  // call back
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Para buscar o id do usuário na url é userId.
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

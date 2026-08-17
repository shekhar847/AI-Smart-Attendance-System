from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):
    if not hashed_password or not plain_password:
        return False
    try:
        return pwd_context.verify(
            plain_password,
            hashed_password
        )
    except Exception:
        # Fallback if DB password is plain text
        return plain_password == hashed_password
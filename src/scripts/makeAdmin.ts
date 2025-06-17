import payload from 'payload'

const makeAdmin = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    local: true,
    mongoURL: process.env.DATABASE_URI || '',
  })

  try {
    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'gravyplaya@gmail.com',
        },
      },
    })

    if (!user.docs || user.docs.length === 0) {
      console.error('User not found')
      process.exit(1)
    }

    const userId = user.docs[0]?.id
    if (!userId) {
      console.error('User ID not found')
      process.exit(1)
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        roles: ['admin'],
      },
    })

    console.log('User updated successfully:', updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
  }

  process.exit(0)
}

makeAdmin()

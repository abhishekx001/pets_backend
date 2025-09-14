const { supabase } = require('../config/supabase');

class Pet {
  static async findAllByUserId(userId) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  static async create(petData) {
    const { data, error } = await supabase
      .from('pets')
      .insert([{
        name: petData.name,
        breed: petData.breed,
        owner_name: petData.owner_name,
        phone: petData.phone,
        photo_url: petData.photo_url,
        user_id: petData.user_id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  static async update(id, userId, updateData) {
    const { data, error } = await supabase
      .from('pets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return true;
  }

  static async exists(id, userId) {
    const { data, error } = await supabase
      .from('pets')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error: ${error.message}`);
    }

    return !!data;
  }
}

module.exports = Pet;

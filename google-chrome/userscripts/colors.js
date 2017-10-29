userScripts.push({
  name: 'colors',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const hostFunction = () => {
      window.Colors = {
        'background_color': '#FFFFFF',
        'top_gradient_color': '#949494',
        'left_column_divider_color': '#EAEAEA',
        'posts_trashhold_bg_color': '#E9E9E9',
        'sublepro_name_color' : '#000000',
        'sublepro_name_hover_bg_color' : '#EAEAEA',

        'more_posts_background_color': '#E7E9E8',
        'more_posts_background_hover_color': '#C7C7C7',
        'more_posts_text_color': '#666666',

        'hide_box_border_color': '#D1D0D0',
        'hide_box_border_shadow_color': '#FFFFFF',
        'hide_box_background_color': '#E6E6E6',
        'hide_box_text_color': '#556E8C',

        'new_comments_1_color': '#F7F7F7',
        'new_comments_2_color': '#F6EFD2',
        'new_comments_3_color': '#FDD2F3',
        'new_comments_4_color': '#FF0000',

        'info_bg_color' : '#D7D7D7',
        'info_arrows_bg_color' : '#C0C0C0',
        'info_text_color' : '#505050',
        'info_links_color' : '#333300',
        'info_links_hover_color' : '#669999',

        'tags_color' : '#222222',
        'tags_hover_bg_color' : '#EAEAEA',

        'text_color' : '#000000',
        'links_color' : '#333300',
        'links_hover_color' : '#669999',
        'links_visited_color' : '#999966',
        'links_system_color' : '#3D3D3D',
        'dd_color' : '#666666',
        'irony_color' : '#CC3333',
        'moderator_color' : '#326CCD',
        'h2_color' : '#326CCD',
        'gray_text_color' : '#666666',
        'gray_bg_color' : '#E9E9E9',
        'inputs_bg_color' : '#F6EFD2',
        'inputs_text_color': '#000000',
        'inputs_border_color': '#CCCCCC',
        'paginator_active_page_color': '#FFFFFF',
        'paginator_active_page_bg_color': '#FF6C24',
        'paginator_line_color': '#CCCCCC',
        'paginator_active_line_color': '#363636',
        'paginator_total_pages_color': '#666666',

        'comments_voting_bg_color' : '#EFEFEF',
        'comments_voting_color' : '#9C9C9C',
        'info_table_divider_color' : '#C1C1C1'
      };
      window.blogsSettingsHandler.setAllStyles();
    };

    const code = 'const LP_colorsInit = ' + hostFunction.toString() + '; LP_colorsInit();';

    $.createScript(code);
  }
});
